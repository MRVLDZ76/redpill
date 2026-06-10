import { useEffect, useRef, useState, useCallback } from 'react'
import './KnowledgeGraph.css'

export type GraphNode = {
  id: string
  title: string
  subtitle: string
  description: string
  href?: string
  cta: string
  comingSoon?: boolean
  x: number
  y: number
  connections: string[]
  icon: 'pill' | 'glasses' | 'rabbit' | 'code' | 'spoon' | 'phone'
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
}

// Matrix-themed SVG icon components
const MatrixIcon = ({ type, isComingSoon }: { type: string; isComingSoon?: boolean }) => {
  const color = isComingSoon ? '#ef4444' : '#16ff9c'
  const secondaryColor = isComingSoon ? '#fecaca' : '#a7ffdb'

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
    case 'spoon':
      return (
        <g className="matrix-icon">
          <ellipse cx="0" cy="-12" rx="7" ry="9" fill={color} opacity="0.9" />
          <rect x="-2.5" y="-3" width="5" height="20" fill={color} opacity="0.85" rx="2" />
          <ellipse cx="0" cy="-12" rx="4" ry="6" fill={secondaryColor} opacity="0.3" />
          <path d="M -3 -8 Q 0 -5 3 -8" stroke={secondaryColor} strokeWidth="1.5" fill="none" opacity="0.5" />
          <line x1="-2.5" y1="5" x2="2.5" y2="5" stroke={secondaryColor} strokeWidth="1" opacity="0.4" />
          <line x1="-2.5" y1="10" x2="2.5" y2="10" stroke={secondaryColor} strokeWidth="1" opacity="0.4" />
        </g>
      )
    case 'phone':
      return (
        <g className="matrix-icon">
          <rect x="-10" y="-16" width="20" height="32" rx="3" fill={color} opacity="0.9" />
          <rect x="-8" y="-13" width="16" height="22" fill="#000" opacity="0.7" />
          <circle cx="0" cy="12" r="3" fill={secondaryColor} opacity="0.8" />
          <rect x="-5" y="-15" width="10" height="2" rx="1" fill={secondaryColor} opacity="0.4" />
          <line x1="-6" y1="-9" x2="6" y2="-9" stroke={color} strokeWidth="0.5" opacity="0.3" />
          <line x1="-6" y1="-5" x2="6" y2="-5" stroke={color} strokeWidth="0.5" opacity="0.3" />
          <line x1="-6" y1="-1" x2="6" y2="-1" stroke={color} strokeWidth="0.5" opacity="0.3" />
          <line x1="-6" y1="3" x2="6" y2="3" stroke={color} strokeWidth="0.5" opacity="0.3" />
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
    subtitle: 'AI TAX ENGINE',
    description: 'Automate Schedule K-1 workflows, BOIR filings and complex tax preparation with AI.',
    href: 'https://prompt.tax',
    cta: 'Access prompt.tax',
    x: 50,
    y: 20,
    connections: ['ontolingent', 'semweb'],
    icon: 'pill',
  },
  {
    id: 'onlyppl',
    title: 'OnlyPPL',
    subtitle: 'HUMAN CONNECTION AI',
    description: 'Describe a problem and instantly connect to the exact person who can solve it.',
    href: 'https://mageek.dev',
    cta: 'Access mageek.dev',
    x: 15,
    y: 50,
    connections: ['studio', 'nebuchadnezzar'],
    icon: 'glasses',
  },
  {
    id: 'studio',
    title: 'Studio',
    subtitle: 'CREATIVE AI ENGINE',
    description: 'Generate content, publish books, and automate social media campaigns using AI.',
    href: 'https://studio.mageek.dev',
    cta: 'Access studio.mageek.dev',
    x: 50,
    y: 80,
    connections: ['onlyppl', 'semweb'],
    icon: 'rabbit',
  },
  {
    id: 'semweb',
    title: 'SemWeb Academy',
    subtitle: 'KNOWLEDGE GRAPHS · RAG · AGENTS',
    description:
      'A professional learning environment for knowledge graphs, RAG, agents, MLOps and the data plumbing underneath — runnable labs, instant validation, and a concept map that keeps prerequisites visible.',
    href: 'https://semweb.academy',
    cta: 'Access semweb.academy',
    x: 85,
    y: 50,
    connections: ['prompttax', 'ontolingent', 'studio'],
    icon: 'code',
  },
  {
    id: 'ontolingent',
    title: 'Ontolingent',
    subtitle: 'ENTERPRISE KNOWLEDGE, MADE COMPUTABLE',
    description:
      'Ontology, retrieval, agents and governance in one tenant-isolated system of record for regulated work.',
    cta: 'Awaiting Activation',
    comingSoon: true,
    x: 50,
    y: 45,
    connections: ['prompttax', 'semweb', 'nebuchadnezzar'],
    icon: 'spoon',
  },
  {
    id: 'nebuchadnezzar',
    title: 'Nebuchadnezzar Node',
    subtitle: 'MATRIX SIGNAL OPS',
    description: 'Route encrypted prompts through a live command node and transmit secure outreach data.',
    cta: 'Open Signal Channel',
    x: 30,
    y: 75,
    connections: ['onlyppl', 'ontolingent'],
    icon: 'phone',
  },
]

function KnowledgeGraph({ onContactClick }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [nodes, setNodes] = useState<GraphNode[]>(initialGraphNodes)
  const [dragState, setDragState] = useState<DragState>({
    nodeId: null,
    startX: 0,
    startY: 0,
    nodeStartX: 0,
    nodeStartY: 0,
  })

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: Math.max(700, window.innerHeight * 0.8),
          })
        }
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const getNodePosition = useCallback(
    (node: GraphNode) => ({
      x: (node.x / 100) * dimensions.width,
      y: (node.y / 100) * dimensions.height,
    }),
    [dimensions]
  )

  const handleNodeMouseDown = (event: React.MouseEvent, nodeId: string) => {
    event.stopPropagation()
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return

    setDragState({
      nodeId,
      startX: event.clientX,
      startY: event.clientY,
      nodeStartX: node.x,
      nodeStartY: node.y,
    })
  }

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!dragState.nodeId) return

      const deltaX = event.clientX - dragState.startX
      const deltaY = event.clientY - dragState.startY

      const newX = dragState.nodeStartX + (deltaX / dimensions.width) * 100
      const newY = dragState.nodeStartY + (deltaY / dimensions.height) * 100

      // Constrain to boundaries
      const clampedX = Math.max(8, Math.min(92, newX))
      const clampedY = Math.max(8, Math.min(92, newY))

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === dragState.nodeId ? { ...node, x: clampedX, y: clampedY } : node
        )
      )
    },
    [dragState, dimensions]
  )

  const handleMouseUp = useCallback(() => {
    setDragState({
      nodeId: null,
      startX: 0,
      startY: 0,
      nodeStartX: 0,
      nodeStartY: 0,
    })
  }, [])

  useEffect(() => {
    if (dragState.nodeId) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragState.nodeId, handleMouseMove, handleMouseUp])

  const handleNodeClick = (node: GraphNode) => {
    if (dragState.nodeId) return // Don't trigger click if we were dragging

    if (node.comingSoon) return

    if (node.href) {
      window.open(node.href, '_blank', 'noreferrer')
    } else {
      onContactClick()
    }
  }

  const isConnected = (nodeId: string) => {
    if (!hoveredNode) return false
    const hovered = nodes.find((n) => n.id === hoveredNode)
    if (!hovered) return false
    return hovered.connections.includes(nodeId) || nodeId === hoveredNode
  }

  return (
    <div className="knowledge-graph-container">
      <div className="graph-hint">
        <span className="graph-hint-icon">⊕</span>
        <span className="graph-hint-text">Drag nodes to rearrange · Hover to explore connections</span>
      </div>
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

          <radialGradient id="node-glow-green">
            <stop offset="0%" stopColor="rgba(22, 255, 156, 0.4)" />
            <stop offset="100%" stopColor="rgba(22, 255, 156, 0)" />
          </radialGradient>

          <radialGradient id="node-glow-red">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.4)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
          </radialGradient>
        </defs>

        {/* Render connections */}
        <g className="connections-layer">
          {nodes.map((node) => {
            const from = getNodePosition(node)
            return node.connections.map((targetId) => {
              const target = nodes.find((n) => n.id === targetId)
              if (!target) return null
              const to = getNodePosition(target)
              
              const isActive = isConnected(node.id) && isConnected(targetId)
              const connectionKey = `${node.id}-${targetId}`

              return (
                <g key={connectionKey} className={`connection ${isActive ? 'connection-active' : ''}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isActive ? 'url(#connection-gradient-active)' : 'url(#connection-gradient)'}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    strokeDasharray={isActive ? '0' : '8 4'}
                    filter={isActive ? 'url(#glow-strong)' : 'url(#glow)'}
                    className="connection-line"
                  />
                  {isActive && (
                    <circle r="3" fill="#16ff9c" filter="url(#glow-strong)" className="connection-particle">
                      <animateMotion dur="2s" repeatCount="indefinite">
                        <mpath xlinkHref={`#path-${connectionKey}`} />
                      </animateMotion>
                    </circle>
                  )}
                </g>
              )
            })
          })}
        </g>

        {/* Render hidden paths for animation */}
        <defs>
          {nodes.map((node) => {
            const from = getNodePosition(node)
            return node.connections.map((targetId) => {
              const target = nodes.find((n) => n.id === targetId)
              if (!target) return null
              const to = getNodePosition(target)
              const connectionKey = `${node.id}-${targetId}`

              return (
                <path
                  key={connectionKey}
                  id={`path-${connectionKey}`}
                  d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                  fill="none"
                />
              )
            })
          })}
        </defs>

        {/* Render nodes */}
        <g className="nodes-layer">
          {nodes.map((node) => {
            const pos = getNodePosition(node)
            const isHighlighted = isConnected(node.id)
            const isDragging = dragState.nodeId === node.id

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className={`graph-node ${isHighlighted ? 'graph-node-highlighted' : ''} ${
                  node.comingSoon ? 'graph-node-coming-soon' : ''
                } ${isDragging ? 'graph-node-dragging' : ''}`}
                onMouseEnter={() => !isDragging && setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onClick={() => handleNodeClick(node)}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                {/* Outer glow ring */}
                <circle
                  r={isHighlighted ? 55 : 50}
                  fill={node.comingSoon ? 'url(#node-glow-red)' : 'url(#node-glow-green)'}
                  opacity={isHighlighted ? 0.6 : 0.3}
                  className="node-glow-ring"
                />

                {/* Background circle */}
                <circle
                  r={40}
                  fill={node.comingSoon ? 'rgba(20, 4, 4, 0.95)' : 'rgba(2, 18, 12, 0.95)'}
                  stroke={node.comingSoon ? '#ef4444' : '#16ff9c'}
                  strokeWidth={isHighlighted ? 2.5 : 2}
                  filter={isHighlighted ? 'url(#glow-strong)' : 'url(#glow)'}
                  className="node-circle"
                />

                {/* Matrix icon */}
                <MatrixIcon type={node.icon} isComingSoon={node.comingSoon} />

                {/* Status indicator dot */}
                <circle
                  r={5}
                  cx={28}
                  cy={-28}
                  fill={node.comingSoon ? '#ef4444' : '#16ff9c'}
                  filter="url(#glow-strong)"
                  className="node-status-dot"
                />

                {/* Node label group */}
                <text
                  textAnchor="middle"
                  className="node-label"
                  fill={node.comingSoon ? '#fecaca' : '#d6fff1'}
                  fontSize="11"
                  fontWeight="700"
                  dy={60}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.title}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Node details panel */}
      {hoveredNode && !dragState.nodeId && (
        <div className="node-details-panel">
          {(() => {
            const node = nodes.find((n) => n.id === hoveredNode)
            if (!node) return null

            return (
              <article className={`node-detail-card ${node.comingSoon ? 'node-detail-coming-soon' : ''}`}>
                {node.comingSoon && (
                  <span className="node-detail-badge">
                    <span className="node-detail-dot" /> TRANSMISSION INCOMING
                  </span>
                )}
                <h3>{node.title}</h3>
                <small>{node.subtitle}</small>
                <p>{node.description}</p>
                {node.comingSoon ? (
                  <div className="node-detail-status">
                    <span className="node-detail-prompt">{'>'}</span>
                    <span className="node-detail-typing">decrypting handshake&hellip;</span>
                  </div>
                ) : null}
                <span className={`node-detail-cta ${node.comingSoon ? 'node-detail-cta-disabled' : ''}`}>
                  {node.cta}
                </span>
              </article>
            )
          })()}
        </div>
      )}
    </div>
  )
}

export default KnowledgeGraph
