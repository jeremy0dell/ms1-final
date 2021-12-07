import { useState } from 'react'
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from "pixi.js";

export default ({thumbnail, highRes, ...props}) => {
    const [image, setImage] = useState(thumbnail)
    const [tempTint, setTempTint] = useState(false)
    const [isHigh, setIsHigh] = useState(false)
    // console.log(props.height, props.width)

    return (
        <Sprite
        texture={PIXI.Texture.from(image)}
        {...props}
        scale={{ x: (isHigh ? 0.0023 : 0.035) * props.node.r, y: (isHigh ? 0.0023 : 0.035) * props.node.r }}
        // tint={tempTint ? '0x000000' : props.tint}
        alpha={tempTint ? 0 : 1}
        pointerdown={(event) => {
            if (props.node.data?.filter === false) {
                // short circuit
                return
            }

            props.setSelected()
            if (!isHigh) {
                setTempTint(true)
                setImage(highRes)
                setIsHigh(true)    
            }

            setTimeout(() => {
                setTempTint(false)
            }, 700)
            props.pixiStage?.current?.app?.stage?.children[0]?.animate({
              time: 1000,
              position: { x: props.node.x, y: props.node.y - 3.7 },
              scale: 70,
              ease: 'easeInOutSine',
              callbackOnComplete: () => {
                  props.setOpen(true)
                //   props.showFilter(false)
              }
            })
          }}
        />
    ) 
    
    
    // : (
    //     <Sprite texture={PIXI.Texture.from(highRes)}
    //     // {...props}
    //     pointerdown={(event) => {
    //         props.pixiStage?.current?.app?.stage?.children[0]?.animate({
    //           time: 1000,
    //           position: { x: props.node.x, y: props.node.y - 4 },
    //           scale: 65,
    //           ease: 'easeInOutSine',
    //           callbackOnComplete: () => {
    //             props.setOpen(true)
    //             setLowRes(false)
    //           }
    //         })
    //       }}
    //     scale={{ x: 0.0085, y: 0.0085 }}
    //     >{console.log('i am existing', props.height, props.scale)}</Sprite>
    // )
}