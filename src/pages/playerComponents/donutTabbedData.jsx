import InfoCard from "./infoCard";

function DonutTabbedData({ donutData }) {
  if (donutData === "not found") {
    return <p>Donut SMP data not found for player</p>
  }
  if (donutData === "error") {
    return <p>An error happened while fetching Donut SMP data</p>
  }
  return (
    <>
    <ul className="info-card-list">
      <InfoCard label='Total Playtime' value={donutData.playtime_hours + ' hours'} />
      <InfoCard label='Status' value={donutData.online ? "Online" : "Offline"} />
      <InfoCard label='Kills' value={donutData.kills.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })} />
      <InfoCard label='Deaths' value={donutData.deaths.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })} />
    </ul>
    <h3>Economy</h3>
    <ul className="info-card-list">
      <InfoCard label='Money' value={donutData.money.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })} />
      <InfoCard label='Money spent' value={donutData.money_spent.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })} />
      <InfoCard label='Money earned' value={donutData.money_earned.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })} />
      <InfoCard label='Shards' value={donutData.shards.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })}/>
    </ul>
    <h3>World</h3>
    <ul className="info-card-list">
      <InfoCard label="Blocks placed" value={donutData.placed_blocks.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })} />
      <InfoCard label="Blocks broken" value={donutData.broken_blocks.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })}/>
    </ul>
    </>
  )
}

export default DonutTabbedData