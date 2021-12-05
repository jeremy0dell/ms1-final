import { useState, useEffect, useRef, useCallback } from 'react'
import { Stage, Container, Sprite, Text, PixiComponent, auto, withPixiApp } from '@inlet/react-pixi';
import { Loader } from '@pixi/loaders'
import * as utils from '@pixi/utils';
import * as PIXI from "pixi.js";
import * as d3 from 'd3'
import TWEEN from '@tweenjs/tween.js'
// import Modal from '@mui/material/Modal'
// import ClickAwayListener from '@mui/material/ClickAwayListener'
import "@fontsource/stardos-stencil";
import './App.css';

import Viewport from './Viewport.tsx';
import ChangeSprite from './ChangeSprite';
import InfoModal from './InfoModal'
import LoadingScreen from './LoadingScreen';

import DATA from './data/posters_filtered.json'
import PACKED from './data/posters_packed.json'

import { KEYWORDS, TOPICS } from './constants'

function App(props) {
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)
  const [resources, setResources] = useState({})
  const [root, setRoot] = useState([])
  const [selected, setSelected] = useState({})
  const [filter, setFilter] = useState('')
  const [canvasSelection, setCanvasSelection] = useState('')
  const [animate, setAnimate] = useState({})

  //modal
  const [open, setOpen] = useState(false)

  const pixiStage = useRef(null)
  const pixiContainer = useRef(null)
  const pixiViewport = useRef(null)

  useEffect(() => {
    const loader = new Loader()

    DATA.forEach((poster) => {
      loader.add(poster.ref, require(`./data/posters/${poster.ref}.jpg`).default)
    })
  
    loader.load((l, resources) => {
      setResources(resources)

      const canvas = d3.select(pixiStage.current._canvas);

      if (canvas) {
        const root = pack(PACKED)
        setRoot(root.descendants().map(n => ({...n, y: n.y - 100, x: n.x - 55})).filter(node => node.depth === 2))
        // canvas.call(zoomBehavior)
        setCanvasSelection(canvas)
        console.log('rendering now?', Viewport, pixiViewport)
      }

      
    })

    return () => {
      utils.clearTextureCache()
      // document.getElementById('pixiStage').innerHTML = ''
    }
  }, [])

  useEffect(() => {
    // Setup the animation loop.
    function animate(time) {
      // console.log('animating')
      requestAnimationFrame(animate)
      TWEEN.update(time)
    }
    requestAnimationFrame(animate)
  }, [])  

  // useEffect(() => {
  //   if (pixiStage?.current?.app?.stage?.children[0]?.animate) {
  //     setAnimate(pixiStage?.current?.app?.stage?.children[0]?.animate)
  //   } else {
  //     console.log('we are trying really hard')
  //   }
  // }, [pixiStage.current])
  // const zoomBehavior = d3.zoom().on("zoom", zoom);

  // function zoom(event) {
  //   console.log(event,'hello')
  //   const container = pixiContainer.current

  //   container.setTransform(event.transform.x, event.transform.y, event.transform.k, event.transform.k)
  //   // console.log(event.transform,container.transform)
  // }

  // d3 stuff now
  const pack = data => d3.pack()
    .size([width, height])
    .padding(1)
  (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value))

  const handleFilter = (word, type, e) => {
    console.log(e)
    setFilter(word)

    var newPacked = {
      name: "Smithsonian",
      children: [
        {name: "World War One", children: []},
        {name: "Between Wars", children: []},
        {name: "World War Two", children: []}
      ]
    }

    var filterCondition

    if (type == 'topic') {
      filterCondition = poster => (poster.topic.includes(word))
    } else {
      filterCondition = poster => (poster.cleanImage.includes(word) || poster.cleanTitle.includes(word))
    }

    Array.from(document.getElementsByClassName('filter')).forEach((el) => el.classList.remove('active'))
    e.target.classList.add("active")

    for (var i = 0; i < PACKED.children.length; i++) {
      // newPacked.children[i].children = PACKED.children[i].children.filter(filterCondition)
      newPacked.children[i].children = PACKED.children[i].children.map((poster) => {
        poster.filter = filterCondition(poster)
        return poster
      })
    }
    const root = pack(newPacked)
    setRoot(root.descendants().map(n => ({...n, y: n.y - 100, x: n.x - 55})).filter(node => node.depth === 2))

    pixiStage?.current?.app?.stage?.children[0]?.animate({
      time: 1200,
      position: {x: width / 2, y: height / 2 },
      scale: 1,
      ease: 'easeInOutSine'
    })

  }

  // create sprites

  const sprites = root.map((node, i) => {
    const {height, width} = resources[node.data.ref].texture.baseTexture
    return <ChangeSprite
      thumbnail={resources[node.data.ref].url}
      highRes={node.data.link}
      x={node.x}
      y={node.y}
      anchor={0.5}
      height={height}
      width={width}
      tint={node.data.filter === undefined ? '0xFFFFFF' : (!node.data.filter ? '0x2a2a2a' : '0xFFFFFF')}
      interactive={true}
      setOpen={setOpen}
      pixiStage={pixiStage}
      node={node}
      setSelected={() => {
        console.log('im seting as selected:', node.data)
        setSelected(node.data)
      }}
    />
  })

  console.log('ASDFASDFS', KEYWORDS, require("@fontsource/stardos-stencil"))

  return (
    <>
      {/* <div className="UI">
        <div  style={{position: 'fixed'}}>
          <div className="filterContainer" style={{position: 'absolute', left: 0, height: height, width: 175, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
            <div className="filter" onClick={() => setFilter('')}>NONE</div>
            {KEYWORDS.map(word => <div className="filter" onClick={(event) => handleFilter(word, 'keyword', event)}>{word.toUpperCase()}</div>)}
          </div>
        </div>
        <div style={{position: 'fixed', right: 0}}>
          <div className="filterContainer" style={{position: 'absolute', right: 0, height: height, width: 295, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
            <div className="filter" onClick={() => setFilter('')}>NONE</div>
            {TOPICS.map(word => <div className="filter topic" onClick={(event) => handleFilter(word[0], 'topic', event)}>{word[1] ? word[1].toUpperCase() :  word[0].toUpperCase()}</div>)}
          </div>
        </div>
      </div> */}
      {
        // deployment
        // Object.entries(resources).length === 0 && root.length === 0 ?
        // DEVELOPMENT
        true ?
          <LoadingScreen /> :
          <>
            <div className="UI">
              <div  style={{position: 'fixed'}}>
                <div className="filterContainer" style={{position: 'absolute', left: 0, height: height, width: 175, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                  <div className="filter" onClick={() => setFilter('')}>NONE</div>
                  {KEYWORDS.map(word => <div className="filter" onClick={(event) => handleFilter(word, 'keyword', event)}>{word.toUpperCase()}</div>)}
                </div>
              </div>
              <div style={{position: 'fixed', right: 0}}>
                <div className="filterContainer" style={{position: 'absolute', right: 0, height: height, width: 295, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                  <div className="filter" onClick={() => setFilter('')}>NONE</div>
                  {TOPICS.map(word => <div className="filter topic" onClick={(event) => handleFilter(word[0], 'topic', event)}>{word[1] ? word[1].toUpperCase() :  word[0].toUpperCase()}</div>)}
                </div>
              </div>
            </div>
          <Stage
            {...{height, width}}
            ref={pixiStage}
            id="pixiStage"
            // onClick={(event) => console.log(event)}
          >
            <Viewport {...{height, width}} innerRef={pixiViewport}>
              <Container ref={pixiContainer}>
                {
                  sprites
                }
                  <Text
                    text="World War One"
                    anchor={0.5}
                    x={630- 55}
                    y={140}
                    style={
                      new PIXI.TextStyle({
                        align: 'center',
                        fontFamily: ['Stardos Stencil'],
                        fontSize: 36,
                        fontWeight: 'normal',
                        fill: ['white'], // gradient
                        // stroke: '#01d27e',
                        strokeThickness: 5,
                        letterSpacing: 10,
                        dropShadow: true,
                        dropShadowColor: 'wheat',
                        dropShadowBlur: 4,
                        dropShadowAngle: Math.PI / 6,
                        dropShadowDistance: 6,
                        // wordWrap: true,
                        // wordWrapWidth: 440,
                      })
                    }
                  />
                  <Text
                    text="World War Two"
                    anchor={0.5}
                    x={1190- 55}
                    y={170}
                    style={
                      new PIXI.TextStyle({
                        align: 'center',
                        fontFamily: ['Stardos Stencil'],
                        fontSize: 36,
                        fontWeight: 'normal',
                        fill: ['white'], // gradient
                        // stroke: '#01d27e',
                        strokeThickness: 5,
                        letterSpacing: 10,
                        dropShadow: true,
                        dropShadowColor: 'wheat',
                        dropShadowBlur: 4,
                        dropShadowAngle: Math.PI / 6,
                        dropShadowDistance: 6,
                        // wordWrap: true,
                        // wordWrapWidth: 440,
                      })
                    }
                  /> 
                  <Text
                  text="Between Wars"
                  anchor={0.5}
                  x={940- 55}
                  y={1020}
                  style={
                    new PIXI.TextStyle({
                      align: 'center',
                      fontFamily: ['Stardos Stencil'],
                      fontSize: 36,
                      fontWeight: 'normal',
                      fill: ['white'], // gradient
                      // stroke: '#01d27e',
                      strokeThickness: 5,
                      letterSpacing: 10,
                      dropShadow: true,
                      dropShadowColor: 'wheat',
                      dropShadowBlur: 4,
                      dropShadowAngle: Math.PI / 6,
                      dropShadowDistance: 6,
                      // wordWrap: true,
                      // wordWrapWidth: 440,
                    })
                  }
                />
              </Container>
            </Viewport>
          </Stage>
          </>
      }
      <InfoModal
        open={open}
        setOpen={setOpen}
        selected={selected}
      />
    </>
  );
}

export default App;
