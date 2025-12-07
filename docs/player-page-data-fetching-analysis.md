# PlayerPage data fetching analysis

_File analyzed: `frontend/src/pages/playerPage.tsx` (353 LOC)_

## 1. Current flow overview

1. `fetchDataForPlayer` resets all state and enters a `try/catch` block.
2. A Mojang lookup (`/v1/players/mojang/:username`) runs first and blocks the rest of the function. Every other request depends on the response of this call because it provides the canonical `uuid` and normalized username.
3. After Mojang resolves, the following requests are executed sequentially, each `await`ing before the next one starts:
   - Status (`/v1/players/status/:uuid`)
   - Hypixel (`/v1/players/hypixel/:uuid`) → if successful, `fetchHypixelGuildMembers` immediately fires another blocking request for guild roster data.
   - Wynncraft (`/v1/players/wynncraft/:uuid`) → when the player has a guild, another sequential request fetches guild details.
   - DonutSMP (`/v1/players/donutsmp/:username`)
   - MCC Island (`/v1/players/mccisland/:uuid`)
   - Capes (`/v1/players/capes/:uuid`)
4. Any thrown error after Mojang short-circuits the rest of the flow, leaving many sections without partial data even if their endpoints are healthy.

### Sequence illustration
```
username → Mojang (uuid)
          ↓
      Status
          ↓
      Hypixel → Hypixel guild page 1
          ↓
     Wynncraft → Wynncraft guild
          ↓
       DonutSMP
          ↓
      MCC Island
          ↓
         Capes
```

### Observed blocking patterns & inefficiencies
| Area | Impact | Notes |
| --- | --- | --- |
| Sequential awaits | **High** | Every post-Mojang request waits for the previous one, so worst-case load time is the sum of all APIs (~2–5s+ on cold loads). |
| Immediate guild fetches | Medium | Hypixel and Wynncraft guild calls block later requests even though their data is only needed once the user opens advanced tabs. |
| Single global `try/catch` | Medium | Any mid-stream failure (e.g., Wynncraft timeout) throws, preventing Donut, MCC or Cape data from ever loading. |
| Loading state granularity | Medium | Status indicators are tied to the sequential flow; late data can keep the entire page in a "loading" state even when the hero content is ready. |
| Lack of caching/de-duping | Low/Medium | Re-searching the same player reruns all network calls even if nothing changed; switching players mid-request causes race conditions. |

## 2. Recommendations (prioritized)

| Priority | Recommendation | Expected benefit | Trade-offs |
| --- | --- | --- | --- |
| 1 | Parallelize post-Mojang fetches using `Promise.allSettled` (status, Hypixel, Wynncraft, Donut, MCC, Capes) while gating only on the Mojang UUID. Defer secondary guild lookups until their tab is opened. | Cuts worst-case load time by ~40–60% because slow APIs no longer block each other. Users see key stats sooner. | Slightly more complex state management; need per-request error handling. |
| 2 | Isolate errors per data source instead of throwing globally. Store errors next to their dataset and render fallback UI inside each tab/section. | Partial data can still render if one upstream API is down, improving resilience and perceived reliability. | Requires new error UI components; more conditional logic. |
| 3 | Introduce lazy/on-demand loading for advanced tabs (Hypixel guild roster, Wynncraft guild, Donut, MCC). Trigger fetch when the user focuses a tab and cache the result to avoid refetching. | Reduces initial payload and speeds up first meaningful paint. Only the data the user views is fetched. | Slight delay the first time a tab is opened; need a per-tab loading indicator. |
| 4 | Enhance loading states with skeleton components and optimistic rendering. Example: show Mojang + status info immediately, while tabs display inline loaders independent of the top-level `status`. | Keeps the hero section interactive while background data streams in; clearer feedback on what is still loading. | Requires additional UI components and wiring. |
| 5 | Add client-side caching & de-duplication (React Query, SWR, or a light custom cache keyed by `uuid`). Reuse data when the user searches the same profile or navigates away/back. | Avoids redundant requests, improves perceived speed, and gives retry/backoff control. | Introduces new dependency (if using a library) and cache invalidation considerations. |
| 6 | Cancel stale requests with `AbortController` when the user searches a new name mid-flight. Combine with `useEffect` cleanup to prevent setting state on unmounted components. | Eliminates race conditions and "flashing" data from previous players. Saves bandwidth. | Requires wrapping `fetch` calls with abort logic and handling `DOMException`s. |
| 7 | Batch or paginate guild fetches on demand. Keep `fetchHypixelGuildMembers` but call it from the tab with `offset` increments ("Load more" or infinite scroll). | Prevents large guilds from blocking other content and reduces first-render cost. | Slightly more interaction to view full roster; need UX for pagination. |

## 3. Implementation details & examples

### 3.1 Parallelizing post-Mojang requests
```ts
const [statusPromise, hypixelPromise, wynnPromise, donutPromise, mcciPromise, capePromise] = [
  fetch(statusUrl + uuid).then((r) => r.json()),
  fetch(hypixelUrl + uuid).then(handleHypixel),
  fetch(wynncraftUrl + uuid).then(handleWynncraft),
  fetch(donutUrl + username).then(handleDonut),
  fetch(mcciUrl + uuid).then(handleMcci),
  fetch(capesUrl + uuid).then(handleCapes),
];

const results = await Promise.allSettled([
  statusPromise,
  hypixelPromise,
  wynnPromise,
  donutPromise,
  mcciPromise,
  capePromise,
]);
```
- Use helper functions (`handleHypixel`, `handleWynncraft`) that set state or return structured errors without throwing.
- `Promise.allSettled` ensures one failure doesn’t drop all other data. Each result can update its corresponding state slice.

### 3.2 Lazy loading advanced tabs
```ts
const tabLoaders = useMemo(() => ({
  hypixelGuild: () => fetchHypixelGuildMembers(uuid, 0),
  wynncraftGuild: () => fetchWynnGuild(uuid),
  donut: () => fetchDonut(username),
  mcci: () => fetchMcci(uuid),
}), [uuid, username]);

function handleTabChange(tab: PlayerTab) {
  if (!loadedTabs.includes(tab)) {
    tabLoaders[tab]?.();
  }
}
```
- Keep lightweight summaries (e.g., Hypixel quick stats) in the initial batch, but defer heavy or optional sections.
- Track per-tab loading/error states to show inline spinners.

### 3.3 Per-source error handling
Instead of throwing, capture errors:
```ts
const [hypixelError, setHypixelError] = useState<Error | null>(null);

try {
  const hypixel = await fetch(hypixelUrl + uuid);
  if (!hypixel.ok) throw new Error("Hypixel unavailable");
  setHypixelData(await hypixel.json());
} catch (err) {
  setHypixelError(err as Error);
}
```
Render inside `AdvancedInfoTabs`:
```tsx
{hypixelError ? (
  <ErrorBanner message="Hypixel API is down, showing cached data." />
) : (
  <HypixelStats data={hypixelData} />
)}
```

### 3.4 Loading state UX
- Replace the single page-level spinner with section-specific skeletons (`<QuickInfoSkeleton />`, tab placeholders).
- Use `status === "loadedMojang"` to show Mojang data immediately while other sections stream in.
- Display a progress summary (e.g., "Hypixel loading…", "MCC Island ready") so users understand what is pending.

### 3.5 Caching & retry strategy
- Introduce React Query/SWR to manage fetching, caching, retries, and background refetching automatically.
- Example with React Query:
```ts
const { data: hypixelData, error: hypixelError, isLoading: hypixelLoading } =
  useQuery({
    queryKey: ["hypixel", uuid],
    queryFn: () => fetch(hypixelUrl + uuid).then((r) => {
      if (!r.ok) throw new Error("Hypixel unavailable");
      return r.json();
    }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
```
- Benefit: No manual status bookkeeping, built-in caching, and automatic abort on component unmount.

### 3.6 Request cancellation
```ts
const controller = new AbortController();
setAbortController(controller);
const response = await fetch(hypixelUrl + uuid, { signal: controller.signal });
```
- Cleanup inside `useEffect` to abort when `username` changes.
- Prevents state updates after unmount and saves bandwidth when users search rapidly.

### 3.7 Guild pagination on demand
- Keep `fetchHypixelGuildMembers` but call it only when the Hypixel tab mounts or when the user scrolls.
- Store `hasMore` flag from the API to decide when to fetch the next `offset`.
- Show a "Load more members" button instead of fetching entire rosters upfront.

## 4. Summary
- The current implementation performs **strictly serial requests** after Mojang lookup, which is the major performance bottleneck.
- Moving to a **parallel + lazy-loaded** approach, coupled with **per-source error handling, improved loading states, caching, and cancellation**, will drastically improve perceived and actual load times without changing backend contracts.
- The recommendations above are ordered by impact so the team can incrementally adopt them.
