import Modal from '@mui/material/Modal'
import ClickAwayListener from '@mui/material/ClickAwayListener'

const refToURL = (ref) => {
    // ead_component:sova-nmah-ac-0433-ref4594
    // NMAH.AC.0433_ref4439
    var newRef = ref
        .toLowerCase()
        .replaceAll('.', '-')
        .replaceAll('_', '-')
        
    return `ead_component:sova-${newRef}`
}

const formatDesc = (desc) => {
    return desc
        .replaceAll('Main Image: ', '')
        .replaceAll('Other Image(s): ', ' - ')
}

export default ({ open, setOpen, selected }) => {
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
                    background: 'rgb(39 40 46 / 93%)',
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
                <div>Description: {formatDesc(selected.image)}</div>
                <div>Topics: {selected.topic.join(', ')}</div>
                <div>Series: {selected.series}</div>
                <div>Country: {selected.country}</div>
                <div><a style={{color: 'lightblue'}} target="_blank" href={`https://collections.si.edu/search/detail/${refToURL(selected.ref)}`}>See full info for this poster</a></div>
                </div>

            }
            </Modal>
        </ClickAwayListener>
    ) : ''
}    
