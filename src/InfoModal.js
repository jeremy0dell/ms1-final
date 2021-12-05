import Modal from '@mui/material/Modal'
import ClickAwayListener from '@mui/material/ClickAwayListener'

export default ({ open, setOpen, selected }) => {
    console.log('im the modal', open, setOpen, selected)
    return selected ? (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                hideBackdrop
                sx={{
                    position: 'absolute',
                    top: '3%',
                    left: 'calc(50% - 230px)',
                    height: 350,
                    width: 350,
                    background: 'rgba(23,24,30,.93)',
                    borderRadius: 10,
                    color: 'white',
                    padding: '40px',
                    '&.Mui-selected': {
                    outline: 'none',
                    }
                }}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            {
                Object.keys(selected).length === 0 ?
                <div>nothings selected</div> :
                <div
                className="modalBox"
                style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                <div style={{textAlign: 'center', fontWeight: '700', fontSize: 20}}>{selected.title}</div>
                <div>Description: {selected.image}</div>
                <div>Topics: {selected.topic.join(', ')}</div>
                <div>Series: {selected.series}</div>
                <div>Country: {selected.country}</div>
                <div>Link: https://whatever.com</div>
                </div>

            }
            </Modal>
        </ClickAwayListener>
    ) : ''
}    
