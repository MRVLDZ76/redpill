import { useEffect, useRef, useState } from 'react'
import './KnowledgeGraph.css'

export type GraphNode = {
  id: string
  title: string
  subtitle: string
  x: number
  y: number
  href?: string
  accent: 'green' | 'red'
  icon: 'pill' | 'glasses' | 'rabbit' | 'code' | 'key' | 'database'
}

type KnowledgeGraphProps = {
  onContactClick: () => void
}

type DragState = {
  nodeId: string | null
  startX: number
  startY: number
  nodeStartX: number
  nodeStartY: number
  moved: boolean
}

const MatrixIcon = ({ type, accent }: { type: GraphNode['icon']; accent: GraphNode['accent'] }) => {
  const color = accent === 'red' ? '#ff5959' : '#1cffae'
  const secondaryColor = accent === 'red' ? '#ffd1d1' : '#aaffdf'

  switch (type) {
    case 'pill':
      return (
        <g className="matrix-icon">
          <ellipse cx="0" cy="-8" rx="18" ry="10" fill={color} opacity="0.9" />
          <ellipse cx="0" cy="8" rx="18" ry="10" fill="#dc2626" opacity="0.9" />
          <ellipse cx="0" cy="-8" rx="15" ry="7" fill={secondaryColor} opacity="0.3" />
          <rect x="-18" y="-8" width="36" height="16" fill={color} opacity="0.85" />
          <line x1="-18" y1="0" x2="18" y2="0" stroke="#000" strokeWidth="1.5" opacity="0.3" />
        </g>
      )
    case 'glasses':
      return (
        <g className="matrix-icon">
          <ellipse cx="-10" cy="0" rx="9" ry="7" fill="none" stroke={color} strokeWidth="2.5" />
          <ellipse cx="10" cy="0" rx="9" ry="7" fill="none" stroke={color} strokeWidth="2.5" />
          <line x1="-1" y1="0" x2="1" y2="0" stroke={color} strokeWidth="2.5" />
          <path d="M -19 0 L -22 -3" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 19 0 L 22 -3" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="-10" cy="0" rx="4" ry="3" fill={secondaryColor} opacity="0.3" />
          <ellipse cx="10" cy="0" rx="4" ry="3" fill={secondaryColor} opacity="0.3" />
        </g>
      )
    case 'rabbit':
      return (
        <g className="matrix-icon">
          <ellipse cx="0" cy="3" rx="12" ry="10" fill={color} opacity="0.9" />
          <circle cx="0" cy="-5" r="8" fill={color} opacity="0.9" />
          <ellipse cx="-8" cy="-15" rx="3" ry="11" fill={color} opacity="0.85" transform="rotate(-15 -8 -15)" />
          <ellipse cx="8" cy="-15" rx="3" ry="11" fill={color} opacity="0.85" transform="rotate(15 8 -15)" />
          <circle cx="-3" cy="-6" r="2" fill="#000" />
          <circle cx="3" cy="-6" r="2" fill="#000" />
          <circle cx="0" cy="-2" r="1.5" fill={secondaryColor} />
          <ellipse cx="0" cy="10" rx="5" ry="4" fill={secondaryColor} opacity="0.4" />
        </g>
      )
    case 'code':
      return (
        <g className="matrix-icon">
          <path d="M -12 0 L -18 -6 L -12 -12" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 12 0 L 18 -6 L 12 -12" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="-2" y1="-14" x2="2" y2="2" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="-12" cy="-18" r="2" fill={secondaryColor} opacity="0.6" />
          <circle cx="0" cy="-18" r="2" fill={secondaryColor} opacity="0.6" />
          <circle cx="12" cy="-18" r="2" fill={secondaryColor} opacity="0.6" />
          <circle cx="-12" cy="6" r="2" fill={secondaryColor} opacity="0.6" />
          <circle cx="12" cy="6" r="2" fill={secondaryColor} opacity="0.6" />
        </g>
      )
    case 'key':
      return (
        <g className="matrix-icon">
          <circle cx="-4" cy="-7" r="8" fill="none" stroke={color} strokeWidth="3" />
          <line x1="2" y1="-1" x2="14" y2="11" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="8" y1="5" x2="12" y2="1" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="11" y1="8" x2="15" y2="4" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="-4" cy="-7" r="3" fill={secondaryColor} opacity="0.4" />
        </g>
      )
    case 'database':
      return (
        <g className="matrix-icon">
          <ellipse cx="0" cy="-10" rx="12" ry="5" fill={color} opacity="0.9" />
          <rect x="-12" y="-10" width="24" height="20" fill={color} opacity="0.75" />
          <ellipse cx="0" cy="10" rx="12" ry="5" fill={color} opacity="0.9" />
          <ellipse cx="0" cy="-10" rx="7" ry="2.5" fill={secondaryColor} opacity="0.25" />
          <ellipse cx="0" cy="10" rx="7" ry="2.5" fill={secondaryColor} opacity="0.2" />
        </g>
      )
    default:
      return null
  }
}

const initialGraphNodes: GraphNode[] = [
  {
    id: 'prompttax',
    title: 'PromptTax',
    subtitle: 'AI Orchestration',
    href: 'https://prompt.tax',
    x: 50,
    y: 18,
    accent: 'red',
    icon: 'pill',
  },
  {
    id: 'onlyppl',
    title: 'OnlyPPL',
    subtitle: 'Human-in-the-Loop',
    href: 'https://mageek.dev',
    x: 16,
    y: 43,
    accent: 'green',
    icon: 'glasses',
  },
  {
    id: 'series-academy',
    title: 'Series Academy',
    subtitle: 'Learning Engine',
    href: 'https://semweb.academy',
    x: 84,
    y: 43,
    accent: 'green',
    icon: 'code',
  },
  {
    id: 'recurring-node',
    title: 'Recurring22AI Node',
    subtitle: 'Data & Memory Layer',
    x: 20,
    y: 75,
    accent: 'green',
    icon: 'database',
  },
  {
    id: 'ontologent',
    title: 'Ontologent',
    subtitle: 'Knowledge Graph Engine',
    x: 50,
    y: 82,
    accent: 'red',
    icon: 'key',
  },
  {
    id: 'studio',
    title: 'Studio',
    subtitle: 'Creative Engine',
    href: 'https://studio.mageek.dev',
    x: 80,
    y: 75,
    accent: 'green',
    icon: 'rabbit',
  },
]

const coreConnections = [
  'prompttax',
  'onlyppl',
  'series-academy',
  'recurring-node',
  'ontologent',
  'studio',
]

const orbitConnections: Array<[string, string]> = [
  ['prompttax', 'onlyppl'],
  ['prompttax', 'series-academy'],
  ['onlyppl', 'recurring-node'],
  ['recurring-node', 'ontologent'],
  ['ontologent', 'studio'],
  ['studio', 'series-academy'],
]

function KnowledgeGraph({ onContactClick }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [nodes, setNodes] = useState<GraphNode[]>(initialGraphNodes)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [dragState, setDragState] = useState<DragState>({
    nodeId: null,
    startX: 0,
    startY: 0,
    nodeStartX: 0,
    nodeStartY: 0,
    moved: false,
  })

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement
        if (container) {
          const width = container.clientWidth
          setDimensions({
            width,
            height: Math.max(520, Math.min(660, width * 0.72)),
          })
        }
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const isConnected = (nodeId: string) => {
    if (!hoveredNode) return false
    return hoveredNode === nodeId || orbitConnections.some(([from, to]) => {
      if (hoveredNode === from) return to === nodeId
      if (hoveredNode === to) return from === nodeId
      return false
    })
  }

  const getNodePosition = (node: GraphNode) => ({
    x: (node.x / 100) * dimensions.width,
    y: (node.y / 100) * dimensions.height,
  })

  const handleNodeMouseDown = (event: React.MouseEvent, nodeId: string) => {
    event.stopPropagation()
    const node = nodes.find((entry) => entry.id === nodeId)
    if (!node) {
      return
    }

    setDragState({
      nodeId,
      startX: event.clientX,
      startY: event.clientY,
      nodeStartX: node.x,
      nodeStartY: node.y,
      moved: false,
    })
  }

  useEffect(() => {
    if (!dragState.nodeId || !dimensions.width || !dimensions.height) {
      return
    }

    const onMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - dragState.startX
      const deltaY = event.clientY - dragState.startY
      const moved = Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4

      const nextX = dragState.nodeStartX + (deltaX / dimensions.width) * 100
      const nextY = dragState.nodeStartY + (deltaY / dimensions.height) * 100

      const clampedX = Math.max(10, Math.min(90, nextX))
      const clampedY = Math.max(10, Math.min(90, nextY))

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === dragState.nodeId
            ? {
                ...node,
                x: clampedX,
                y: clampedY,
              }
            : node
        )
      )

      if (moved && !dragState.moved) {
        setDragState((prev) => ({ ...prev, moved: true }))
      }
    }

    const onMouseUp = () => {
      setDragState({
        nodeId: null,
        startX: 0,
        startY: 0,
        nodeStartX: 0,
        nodeStartY: 0,
        moved: false,
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [dragState, dimensions])

  const handleNodeClick = (node: GraphNode) => {
    if (dragState.moved) {
      return
    }

    if (node.href) {
      window.open(node.href, '_blank', 'noreferrer')
      return
    }

    onContactClick()
  }

  const center = {
    x: dimensions.width / 2,
    y: dimensions.height / 2,
  }

  const outerRingRadius = Math.min(dimensions.width, dimensions.height) * 0.29
  const innerRingRadius = Math.min(dimensions.width, dimensions.height) * 0.18

  return (
    <div className="knowledge-graph-container">
      <svg ref={svgRef} className="knowledge-graph-svg" width={dimensions.width} height={dimensions.height}>
        <defs>
          <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(22, 255, 156, 0.1)" />
            <stop offset="50%" stopColor="rgba(22, 255, 156, 0.4)" />
            <stop offset="100%" stopColor="rgba(22, 255, 156, 0.1)" />
          </linearGradient>
          
          <linearGradient id="connection-gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.3)" />
            <stop offset="50%" stopColor="rgba(22, 255, 156, 0.8)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0.3)" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="graph-rings" aria-hidden="true">
          <circle cx={center.x} cy={center.y} r={outerRingRadius} className="ring ring-outer" />
          <circle cx={center.x} cy={center.y} r={innerRingRadius} className="ring ring-inner" />
          <circle cx={center.x} cy={center.y} r={outerRingRadius * 1.22} className="ring ring-faint" />
        </g>

        <g className="graph-grid" aria-hidden="true">
          <line x1={center.x} y1={center.y - outerRingRadius * 1.1} x2={center.x} y2={center.y + outerRingRadius * 1.1} />
          <line x1={center.x - outerRingRadius * 0.95} y1={center.y} x2={center.x + outerRingRadius * 0.95} y2={center.y} />
        </g>

        <g className="connections-layer">
          {coreConnections.map((targetId) => {
            const target = nodes.find((node) => node.id === targetId)
            if (!target) {
              return null
            }

            const to = getNodePosition(target)
            const isActive = hoveredNode === targetId

            return (
              <g key={`core-${targetId}`} className={`connection ${isActive ? 'connection-active' : ''}`}>
                <line
                  x1={center.x}
                  y1={center.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isActive ? 'url(#connection-gradient-active)' : 'url(#connection-gradient)'}
                  strokeWidth={isActive ? 2.8 : 1.6}
                  strokeDasharray={isActive ? '0' : '8 5'}
                  filter={isActive ? 'url(#glow-strong)' : 'url(#glow)'}
                  className="connection-line"
                />
              </g>
            )
          })}

          {orbitConnections.map(([fromId, toId]) => {
            const from = nodes.find((node) => node.id === fromId)
            const to = nodes.find((node) => node.id === toId)
            if (!from || !to) {
              return null
            }

            const fromPos = getNodePosition(from)
            const toPos = getNodePosition(to)
            const isActive = hoveredNode === fromId || hoveredNode === toId

            return (
              <g key={`${fromId}-${toId}`} className={`connection connection-orbit ${isActive ? 'connection-active' : ''}`}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={isActive ? 'url(#connection-gradient-active)' : 'rgba(255, 89, 89, 0.18)'}
                  strokeWidth={isActive ? 2 : 1.2}
                  strokeDasharray="3 7"
                  className="connection-line"
                />
              </g>
            )
          })}
        </g>

        <g className="core-layer" onClick={onContactClick} role="button" tabIndex={0}>
          <circle cx={center.x} cy={center.y} r="70" className="core-node-glow" />
          <polygon
            points={`${center.x},${center.y - 62} ${center.x + 56},${center.y - 30} ${center.x + 56},${center.y + 30} ${center.x},${center.y + 62} ${center.x - 56},${center.y + 30} ${center.x - 56},${center.y - 30}`}
            className="core-node-shell"
          />
          <polygon
            points={`${center.x},${center.y - 46} ${center.x + 40},${center.y - 22} ${center.x + 40},${center.y + 22} ${center.x},${center.y + 46} ${center.x - 40},${center.y + 22} ${center.x - 40},${center.y - 22}`}
            className="core-node-inner"
          />
          <text x={center.x} y={center.y - 6} textAnchor="middle" className="core-node-icon">
            {'</>'}
          </text>
          <text x={center.x} y={center.y + 18} textAnchor="middle" className="core-node-label">
            Red Pill
          </text>
          <text x={center.x} y={center.y + 36} textAnchor="middle" className="core-node-label core-node-label-sub">
            Core
          </text>
        </g>

        <g className="nodes-layer">
          {nodes.map((node) => {
            const pos = getNodePosition(node)
            const isHighlighted = isConnected(node.id)
            const isDragging = dragState.nodeId === node.id

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className={`graph-node graph-node-${node.accent} ${isHighlighted ? 'graph-node-highlighted' : ''} ${isDragging ? 'graph-node-dragging' : ''}`}
                onMouseEnter={() => !isDragging && setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onMouseDown={(event) => handleNodeMouseDown(event, node.id)}
                onClick={() => handleNodeClick(node)}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                <circle r={isHighlighted ? 53 : 48} className="node-glow-ring" />
                <circle
                  r={36}
                  fill={node.accent === 'red' ? 'rgba(24, 7, 7, 0.96)' : 'rgba(2, 18, 12, 0.96)'}
                  stroke={node.accent === 'red' ? '#ff5959' : '#1cffae'}
                  strokeWidth={isHighlighted ? 2.8 : 2.2}
                  filter={isHighlighted ? 'url(#glow-strong)' : 'url(#glow)'}
                  className="node-circle"
                />
                <MatrixIcon type={node.icon} accent={node.accent} />
                <circle
                  r={5}
                  cx={28}
                  cy={-28}
                  fill={node.accent === 'red' ? '#ff5959' : '#1cffae'}
                  filter="url(#glow-strong)"
                  className="node-status-dot"
                />
                <text
                  textAnchor="middle"
                  className="node-label"
                  fill={node.accent === 'red' ? '#ffd1d1' : '#e4fff4'}
                  fontSize="11.5"
                  fontWeight="700"
                  dy={58}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.title}
                </text>
                <text
                  textAnchor="middle"
                  className="node-subtitle"
                  fill="#c7dbd1"
                  fontSize="11"
                  dy={76}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.subtitle}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

export default KnowledgeGraph
