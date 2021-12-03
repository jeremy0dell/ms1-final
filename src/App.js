import { useState, useEffect, useRef, useCallback } from 'react'
import { Stage, Container, Sprite, Graphics, PixiComponent, auto } from '@inlet/react-pixi';
import { Loader } from '@pixi/loaders'
import * as utils from '@pixi/utils';
import * as d3 from 'd3'
import TWEEN from '@tweenjs/tween.js'
import { Viewport } from 'pixi-viewport'
import logo from './logo.svg';
import './App.css';

import DATA from './data/posters_filtered.json'
import PACKED from './data/posters_packed.json'
// import sheet from './data/sprites/sprite-sheets-0.json'

import { KEYWORDS, TOPICS } from './constants'

function App() {
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)
  const [resources, setResources] = useState({})
  const [root, setRoot] = useState([])
  const [filter, setFilter] = useState('')
  const [canvasSelection, setCanvasSelection] = useState('')
  const [viewport, setViewport] = useState({})
  const pixiStage = useRef(null)
  const pixiContainer = useRef(null)
  
  const zoomBehavior = d3.zoom().on("zoom", zoom);

  function zoom(event) {
    console.log(event,'hello')
    const container = pixiContainer.current

    container.setTransform(event.transform.x, event.transform.y, event.transform.k, event.transform.k)
    // console.log(event.transform,container.transform)
  }


  // d3 stuff now
  const pack = data => d3.pack()
    .size([width, height])
    .padding(1)
  (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value))

  const handleFilter = (word, type) => {
    console.log('running', word, type)
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

    for (var i = 0; i < PACKED.children.length; i++) {
      newPacked.children[i].children = PACKED.children[i].children.filter(filterCondition)
    }


    console.log('p', PACKED, newPacked)
    const root = pack(newPacked)
    setRoot(root.descendants().filter(node => node.depth === 2))
    console.log('set Root', root)
  }

  useEffect(() => {
    console.log('running')
    const loader = new Loader()

    DATA.forEach((poster) => {
      loader.add(poster.ref, require(`./data/posters/${poster.ref}.jpg`).default)
    })
  
    loader.load((l, resources) => {
      setResources(resources)

      const canvas = d3.select(pixiStage.current._canvas);

      if (canvas) {
        console.log('WE DID IT', pixiStage.current)

        const root = pack(PACKED)
        setRoot(root.descendants().filter(node => node.depth === 2))
        canvas.call(zoomBehavior)
        setCanvasSelection(canvas)
        console.log('rendering now?', canvas)

        // create viewpor

        // console.log(root.descendants().filter(node => node.depth === 2))
      }

      
    })

    return () => {
      utils.clearTextureCache()
      document.getElementById('pixiStage').innerHTML = ''
    }
  }, [])

  // useEffect(() => {
  //   console.log('filter effect', filter)
  //   if (filter === '') {
  //     // const root = pack(PACKED)
  //     // setRoot(root.descendants().filter(node => node.depth === 2))
  //     return
  //   }



  //   var newPacked = {
  //     name: "Smithsonian",
  //     children: [
  //       {name: "World War One", children: []},
  //       {name: "Between Wars", children: []},
  //       {name: "World War Two", children: []}
  //     ]
  //   }

  //   for (var i = 0; i < PACKED.children.length; i++) {
  //     newPacked.children[i].children = PACKED.children[i].children.filter(poster => (poster.cleanImage.includes(filter) || poster.cleanTitle.includes(filter)))
  //   }

  //   const root = pack(newPacked)
  //   setRoot(root.descendants().filter(node => node.depth === 2))
  // }, [filter])

  useEffect(() => {
    // Setup the animation loop.
    function animate(time) {
      // console.log('animating')
      requestAnimationFrame(animate)
      TWEEN.update(time)
    }
    requestAnimationFrame(animate)
  }, [])


  return (
    <>
      {console.log('ui is going')}
      <div className="UI">
        <div  style={{position: 'fixed'}}>
          <div style={{position: 'absolute', left: 0, height: height, width: 100, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            {/* <div className="filter" onClick={() => setFilter('')}>NONE</div> */}
            {KEYWORDS.map(word => <div className="filter" onClick={() => handleFilter(word, 'keyword')}>{word.toUpperCase()}</div>)}
          </div>
        </div>
        <div style={{position: 'fixed', right: 0}}>
          <div style={{position: 'absolute', right: 0, height: height, width: 300, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            {/* <div className="filter" onClick={() => setFilter('')}>NONE</div> */}
            {TOPICS.map(word => <div className="filter topic" onClick={() => handleFilter(word, 'topic')}>{word.toUpperCase()}</div>)}
          </div>
        </div>
      </div>
      {
        Object.entries(resources).length === 0 && root.length === 0 ?
          'loading' :
          <Stage
            {...{height, width}}
            ref={pixiStage}
            id="pixiStage"
            // onClick={(event) => console.log(event)}
          >
            <Container ref={pixiContainer}>
              {
                root.map(node => {
                  // console.log(node, resources[node.data.ref])
                  return <Sprite
                    image={resources[node.data.ref].url}
                    x={node.x}
                    y={node.y}
                    anchor={0.5}
                    scale={{ x: 0.035 * node.r, y: 0.035 * node.r }}
                    interactive={true}
                    pointerdown={(event) => {
                      console.log('hi')
                      // viewport.animate({
                      //   time: 3000,
                      //   scale: 10,
                      //   position: {x: node.x ,y: node.y}
                      // // });
                      // const container = pixiContainer.current

                      // const {d, tx, ty} = container.transform.localTransform
                      // const {x, y} = event.target

                      // console.log(d,tx,ty, x, y)

                      // const coords = {tx, ty, d} // Start at (0, 0)
                      // const zoomStart = {d}

                      // const zoomTween = new TWEEN.Tween(zoomStart)
                      //   .to({d: 85}, 2000)
                      //   .onUpdate(() => {
                      //     canvasSelection.call(zoomBehavior.scaleTo, zoomStart.d)
                      //   })
                      //   .onComplete(() => {
                      //     console.log('transition done')
                      //   })

                      // const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
                      //   .to({tx: x - width / 2, ty: y - height / 2, d: 50}, 1000) // Move to (300, 200) in 1 second.
                      //   // .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
                      //   .onUpdate(() => {
                      //     console.log(coords.x, coords.y, 1, 1)
                      //       // Called after tween.js updates 'coords'.
                      //       // Move 'box' to the position described by 'coords' with a CSS translation.
                      //       // console.log('sup', coords.tx, container.transform.localTransform.tx)
                      //       container.setTransform(-coords.tx, -coords.ty, coords.d, coords.d)
                      //       // canvasSelection.call(zoomBehavior.scaleTo, coords.d)
                      //     // canvasSelection.call(zoomBehavior.translateTo, coords.tx, coords, ty)
                      //       // canvasSelection.call(zoomBehavior.translateBy, (coords.tx - container.transform.localTransform.tx) * container.transform.localTransform.d, (coords.ty - container.transform.localTransform.ty) * container.transform.localTransform.d)
                      //       // canvasSelection.call(zoomBehavior.transform, d3.zoomIdentity)
                      //   })
                      //   .onComplete(() => {
                      //     console.log('now zoom')
                      //     // zoomTween.start()

                      //   })
                      //   .start()
                        // .transition().call(zoom.translateTo, 300, 300)
                    }}
                  />
                })
              }
            </Container>
          </Stage>
      }
    </>
  );
}

export default App;
