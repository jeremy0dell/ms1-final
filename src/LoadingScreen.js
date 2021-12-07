import styles from './LoadingScreen.module.css'

export default () => {
    return (
        <div className={styles.container}>
            <div className="imgtop"></div>
            <div style={{fontSize: 24}}>Please be patient</div>
            <div style={{fontSize: 75, color: 'wheat'}}>Decoding Conflict</div>
            <div style={{fontSize: 30, color: 'wheat'}}>An exploratory visualization of The National Museum of American History’s wartime propaganda poster collection</div>
            <div style={{fontSize: 24}}>is now</div>
            <div className={styles.loading}>
                Loading
            </div>
            <div className="imgbottom">
                
            </div>
        </div>
    )
}