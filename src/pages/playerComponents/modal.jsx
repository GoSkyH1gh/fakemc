import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import './modal.css';

const modalRoot = document.getElementById('modal-portal');

function Modal({ isOpen, onClose, children }) {
    return createPortal(
        <>
        <div
            className='modal-backdrop'
            onClick={onClose}>
        </div>
        <div
            className='modal-content'>
            <button onClick={onClose}>X</button>
            this is a modal
        </div>
        </>, modalRoot
    )
}

export default Modal