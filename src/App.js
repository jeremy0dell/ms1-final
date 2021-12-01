import { useState, useEffect, useRef, useCallback } from 'react'
import { Stage, Container, Sprite, Graphics, PixiComponent, auto } from '@inlet/react-pixi';
import { Loader } from '@pixi/loaders'
import * as utils from '@pixi/utils';
import * as d3 from 'd3'
import logo from './logo.svg';
import './App.css';

import DATA from './data/posters_filtered.json'
import PACKED from './data/posters_packed.json'
// import sheet from './data/sprites/sprite-sheets-0.json'

import { KEYWORDS } from './constants'

function App() {
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)
  const [resources, setResources] = useState({})
  const [root, setRoot] = useState([])
  const [filter, setFilter] = useState('')
  const pixiStage = useRef(null)
  const pixiContainer = useRef(null)
  
  const zoomBehavior = d3.zoom().on("zoom", zoom);

  function zoom(event) {
    const container = pixiContainer.current

    container.setTransform(event.transform.x, event.transform.y, event.transform.k, event.transform.k)
  }


  // d3 stuff now
  const pack = data => d3.pack()
    .size([width, height])
    .padding(10)
  (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value))

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
        console.log('WE DID IT')

        const root = pack(PACKED)
        setRoot(root.descendants().filter(node => node.depth === 2))
        canvas.call(zoomBehavior)

        console.log('rendering now?')

        // console.log(root.descendants().filter(node => node.depth === 2))
      }

      
    })

    return () => {
      utils.clearTextureCache()
      document.getElementById('pixiStage').innerHTML = ''
    }
  }, [])

  useEffect(() => {
    console.log('filter effect', filter)
    if (filter === '') return

    var newPacked = {
      name: "Smithsonian",
      children: [
        {name: "World War One", children: []},
        {name: "Between Wars", children: []},
        {name: "World War Two", children: []}
      ]
    }

    for (var i = 0; i < PACKED.children.length; i++) {
      newPacked.children[i].children = PACKED.children[i].children.filter(poster => (poster.cleanImage.includes(filter) || poster.cleanTitle.includes(filter)))
    }

    console.log(newPacked)

    const root = pack(newPacked)
    console.log('sending in', root.descendants().filter(node => node.depth === 2))
    setRoot(root.descendants().filter(node => node.depth === 2))
  }, [filter])


  return (
    <>
      <div className="UI" style={{position: 'fixed'}}>
        <div style={{position: 'absolute', left: 0, height: '100%', width: 100, color: 'white', display: 'flex', flexDirection: 'column'}}>
          <h3>Filters: {filter}</h3>
          {KEYWORDS.map(word => <div onClick={() => setFilter(word)}>{word}</div>)}
        </div>
      </div>
      {
        Object.entries(resources).length === 0 && root.length === 0 ?
          'loading' :
          <Stage {...{height, width}} ref={pixiStage} id="pixiStage">
            <Container ref={pixiContainer}>
              {/* {
                Object.entries(sheet.frames).map(frame => {
                  return <Sprite
                    image={resources[frame[0].split('.jpg')[0]].url}
                    x={frame[1].frame.x}
                    y={frame[1].frame.y}
                  />
                })
              } */}
              {
                root.map(node => {
                  // console.log(node, resources[node.data.ref])
                  return <Sprite
                    image={resources[node.data.ref].url}
                    x={node.x}
                    y={node.y}
                    scale={{ x: 0.1, y: 0.1 }}
                    // height={8}
                    // width={8}
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
