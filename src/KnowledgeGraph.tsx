import { useEffect, useMemo, useRef, useState } from 'react'
import { Database, FileText, Layers3, Mail, Network, Server, Settings2, Workflow } from 'lucide-react'
import './KnowledgeGraph.css'
import { getKnowledgeGraphContent, type Locale } from './content'

type ItemKind = 'input' | 'layer' | 'output' | 'capability'

type DiagramItem = {
  id: string
  title: string
  kind: ItemKind
  detail: string
  purpose?: string
  value?: string
  outcome?: string
  icon?: typeof Database
}

type Relationship = {
  inputIds: string[]
  layerIds: string[]
  outputIds: string[]
  capabilityIds: string[]
}

type Position = {
  left: number
  right: number
  centerY: number
}

type TooltipState = {
  layer: DiagramItem
  x: number
  y: number
} | null

const inputs: DiagramItem[] = [
  { id: 'databases', title: 'Databases', kind: 'input', icon: Database, detail: 'Structured records, operational systems, and enterprise data stores.' },
  { id: 'documents', title: 'Documents', kind: 'input', icon: FileText, detail: 'Policies, contracts, specifications, and unstructured operational knowledge.' },
  { id: 'emails', title: 'Emails', kind: 'input', icon: Mail, detail: 'Institutional memory and decision context captured in communication trails.' },
  { id: 'apis', title: 'APIs', kind: 'input', icon: Workflow, detail: 'Cross-system interfaces exposing entities, events, and process state.' },
  { id: 'crm', title: 'CRM', kind: 'input', icon: Network, detail: 'Customer and account context that must align with enterprise ontology.' },
  { id: 'erp', title: 'ERP', kind: 'input', icon: Server, detail: 'Core operational and financial systems with high-value business semantics.' },
  { id: 'applications', title: 'Applications', kind: 'input', icon: Settings2, detail: 'Line-of-business platforms with fragmented but critical operational context.' },
  { id: 'data-lakes', title: 'Data Lakes', kind: 'input', icon: Layers3, detail: 'Large repositories requiring semantic curation before enterprise AI usage.' },
]

const layersById: Record<string, DiagramItem> = {
  governance: {
    id: 'governance',
    title: 'Governance',
    kind: 'layer',
    detail: 'Ownership, policy, and stewardship controls for trusted enterprise knowledge.',
    purpose: 'Establish accountability and control over enterprise knowledge assets.',
    value: 'Increases trust, compliance confidence, and adoption readiness.',
    outcome: 'AI systems operate within defined operational and regulatory constraints.',
  },
  'data-engineering': {
    id: 'data-engineering',
    title: 'Data Engineering',
    kind: 'layer',
    detail: 'Ingestion, normalization, lineage, and integration of fragmented source systems.',
    purpose: 'Transform fragmented source data into reliable, usable flows.',
    value: 'Improves interoperability and reduces downstream integration failure.',
    outcome: 'Stable enterprise information flows that support scalable AI operations.',
  },
  'semantic-models': {
    id: 'semantic-models',
    title: 'Semantic Models',
    kind: 'layer',
    detail: 'Shared conceptual structures that map business meaning to technical systems.',
    purpose: 'Translate technical records into consistent business concepts.',
    value: 'Aligns teams, systems, and analysis around shared meaning.',
    outcome: 'Less ambiguity and stronger reasoning quality across AI applications.',
  },
  'knowledge-graphs': {
    id: 'knowledge-graphs',
    title: 'Knowledge Graphs',
    kind: 'layer',
    detail: 'Connected entity and relationship architecture with provenance and context.',
    purpose: 'Connect entities, events, and dependencies in a queryable graph fabric.',
    value: 'Enhances retrieval, traceability, and explainability.',
    outcome: 'Context-aware AI outputs grounded in enterprise relationships.',
  },
  ontologies: {
    id: 'ontologies',
    title: 'Ontologies',
    kind: 'layer',
    detail: 'Formal domain models that define enterprise language and conceptual logic.',
    purpose: 'Define durable enterprise meaning and conceptual consistency.',
    value: 'Reduces terminology drift across systems and teams.',
    outcome: 'Reliable semantic alignment for enterprise transformation.',
  },
  'knowledge-accretion-engine': {
    id: 'knowledge-accretion-engine',
    title: 'Knowledge Accretion Engine',
    kind: 'layer',
    detail: 'Continuous enrichment loops that compound enterprise intelligence over time.',
    purpose: 'Capture feedback and evolve the architecture continuously.',
    value: 'Turns static architecture into a compounding capability.',
    outcome: 'Systems improve with usage instead of degrading with complexity.',
  },
}

const layerStackOrder = [
  layersById['knowledge-accretion-engine'],
  layersById.ontologies,
  layersById['knowledge-graphs'],
  layersById['semantic-models'],
  layersById['data-engineering'],
  layersById.governance,
]

const outputs: DiagramItem[] = [
  { id: 'ai-assistants', title: 'AI Assistants', kind: 'output', detail: 'Assistants grounded in enterprise context and governance.' },
  { id: 'enterprise-search', title: 'Enterprise Search', kind: 'output', detail: 'Semantic retrieval that understands entities and relationships.' },
  { id: 'agentic-systems', title: 'Agentic Systems', kind: 'output', detail: 'Agents orchestrated with enterprise context and operational controls.' },
  { id: 'decision-support', title: 'Decision Support', kind: 'output', detail: 'Reasoning paths connecting facts, policy, and business outcomes.' },
  { id: 'analytics', title: 'Analytics', kind: 'output', detail: 'Business analysis aligned to shared semantic definitions.' },
  { id: 'workflow-automation', title: 'Workflow Automation', kind: 'output', detail: 'Automation informed by entity state, policy, and enterprise rules.' },
  { id: 'knowledge-discovery', title: 'Knowledge Discovery', kind: 'output', detail: 'Insight surfacing across connected enterprise context.' },
]

const capabilities: DiagramItem[] = [
  { id: 'entity-resolution', title: 'Entity Resolution', kind: 'capability', detail: 'Resolve duplicate and fragmented identities across systems.' },
  { id: 'grounded-retrieval', title: 'Grounded Retrieval', kind: 'capability', detail: 'Return context with provenance and semantic precision.' },
  { id: 'taxonomy-design', title: 'Taxonomy Design', kind: 'capability', detail: 'Organize domain terms and hierarchies for enterprise reuse.' },
]

const inputRelationships: Record<string, Relationship> = {
  databases: {
    inputIds: ['databases'],
    layerIds: ['data-engineering', 'semantic-models', 'knowledge-graphs'],
    outputIds: ['analytics', 'decision-support'],
    capabilityIds: ['grounded-retrieval'],
  },
  documents: {
    inputIds: ['documents'],
    layerIds: ['semantic-models', 'knowledge-graphs'],
    outputIds: ['enterprise-search', 'ai-assistants'],
    capabilityIds: ['grounded-retrieval', 'taxonomy-design'],
  },
  emails: {
    inputIds: ['emails'],
    layerIds: ['knowledge-graphs', 'knowledge-accretion-engine'],
    outputIds: ['ai-assistants', 'knowledge-discovery'],
    capabilityIds: ['grounded-retrieval'],
  },
  apis: {
    inputIds: ['apis'],
    layerIds: ['data-engineering', 'governance'],
    outputIds: ['agentic-systems', 'workflow-automation'],
    capabilityIds: ['entity-resolution'],
  },
  crm: {
    inputIds: ['crm'],
    layerIds: ['ontologies', 'knowledge-accretion-engine'],
    outputIds: ['agentic-systems', 'workflow-automation'],
    capabilityIds: ['entity-resolution'],
  },
  erp: {
    inputIds: ['erp'],
    layerIds: ['governance', 'data-engineering', 'semantic-models'],
    outputIds: ['decision-support', 'workflow-automation'],
    capabilityIds: ['entity-resolution'],
  },
  applications: {
    inputIds: ['applications'],
    layerIds: ['semantic-models', 'knowledge-accretion-engine'],
    outputIds: ['agentic-systems', 'ai-assistants'],
    capabilityIds: ['grounded-retrieval'],
  },
  'data-lakes': {
    inputIds: ['data-lakes'],
    layerIds: ['data-engineering', 'knowledge-graphs'],
    outputIds: ['analytics', 'knowledge-discovery'],
    capabilityIds: ['taxonomy-design'],
  },
}

function mergeRelationship(parts: Partial<Relationship>[]): Relationship {
  return {
    inputIds: [...new Set(parts.flatMap((part) => part.inputIds ?? []))],
    layerIds: [...new Set(parts.flatMap((part) => part.layerIds ?? []))],
    outputIds: [...new Set(parts.flatMap((part) => part.outputIds ?? []))],
    capabilityIds: [...new Set(parts.flatMap((part) => part.capabilityIds ?? []))],
  }
}

type KnowledgeGraphProps = {
  locale: Locale
}

function KnowledgeGraph({ locale }: KnowledgeGraphProps) {
  const content = getKnowledgeGraphContent(locale)
  const localizedInputs = content.inputs
  const localizedLayers = content.layers
  const localizedOutputs = content.outputs
  const localizedCapabilities = content.capabilities
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [positions, setPositions] = useState<Record<string, Position>>({})
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [scrollStage, setScrollStage] = useState(0)
  const [tooltip, setTooltip] = useState<TooltipState>(null)

  const layerRelationships = useMemo(() => {
    const entries = layerStackOrder.map((layer) => {
      const matches = Object.values(inputRelationships).filter((relationship) => relationship.layerIds.includes(layer.id))
      return [layer.id, mergeRelationship(matches)]
    })

    return Object.fromEntries(entries) as Record<string, Relationship>
  }, [])

  const outputRelationships = useMemo(() => {
    const entries = outputs.map((output) => {
      const matches = Object.values(inputRelationships).filter((relationship) => relationship.outputIds.includes(output.id))
      return [output.id, mergeRelationship(matches)]
    })

    return Object.fromEntries(entries) as Record<string, Relationship>
  }, [])

  const capabilityRelationships = useMemo(() => {
    const entries = capabilities.map((capability) => {
      const matches = Object.values(inputRelationships).filter((relationship) => relationship.capabilityIds.includes(capability.id))
      return [capability.id, mergeRelationship(matches)]
    })

    return Object.fromEntries(entries) as Record<string, Relationship>
  }, [])

  const relationshipMap = useMemo(
    () => ({ ...inputRelationships, ...layerRelationships, ...outputRelationships, ...capabilityRelationships }),
    [capabilityRelationships, layerRelationships, outputRelationships]
  )

  const stageRelationship: Relationship = useMemo(() => {
    if (scrollStage === 0) {
      return {
        inputIds: inputs.map((item) => item.id),
        layerIds: [],
        outputIds: [],
        capabilityIds: [],
      }
    }

    if (scrollStage === 1) {
      return {
        inputIds: inputs.map((item) => item.id),
        layerIds: layerStackOrder.map((item) => item.id),
        outputIds: [],
        capabilityIds: capabilities.map((item) => item.id),
      }
    }

    return {
      inputIds: inputs.map((item) => item.id),
      layerIds: layerStackOrder.map((item) => item.id),
      outputIds: outputs.map((item) => item.id),
      capabilityIds: capabilities.map((item) => item.id),
    }
  }, [scrollStage])

  const activeRelationship = hoveredId ? relationshipMap[hoveredId] : stageRelationship

  const activeItem = hoveredId
    ? [...inputs, ...layerStackOrder, ...outputs, ...capabilities].find((item) => item.id === hoveredId) ?? layerStackOrder[2]
    : scrollStage === 0
      ? inputs[0]
      : scrollStage === 1
        ? layerStackOrder[2]
        : outputs[0]

  useEffect(() => {
    const measure = () => {
      if (!wrapperRef.current) {
        return
      }

      const containerRect = wrapperRef.current.getBoundingClientRect()
      const nextPositions = Object.fromEntries(
        Object.entries(itemRefs.current)
          .filter(([, element]) => Boolean(element))
          .map(([id, element]) => {
            const rect = element!.getBoundingClientRect()
            return [
              id,
              {
                left: rect.left - containerRect.left,
                right: rect.right - containerRect.left,
                centerY: rect.top - containerRect.top + rect.height / 2,
              },
            ]
          })
      )

      setPositions(nextPositions)
    }

    const resizeObserver = new ResizeObserver(measure)
    const frameId = window.requestAnimationFrame(measure)

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current)
    }

    window.addEventListener('resize', measure)

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!wrapperRef.current) {
        return
      }

      const rect = wrapperRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height)

      if (progress < 0.4) {
        setScrollStage(0)
      } else if (progress < 0.7) {
        setScrollStage(1)
      } else {
        setScrollStage(2)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const connectorPaths = useMemo(() => {
    const layerLines = inputs.flatMap((input) => {
      const from = positions[input.id]
      if (!from) {
        return []
      }

      return (inputRelationships[input.id]?.layerIds ?? []).flatMap((layerId) => {
        const to = positions[layerId]
        if (!to) {
          return []
        }

        const active = activeRelationship.inputIds.includes(input.id) && activeRelationship.layerIds.includes(layerId)

        return [
          {
            key: `${input.id}-${layerId}`,
            d: `M ${from.right} ${from.centerY} C ${from.right + 24} ${from.centerY}, ${to.left - 30} ${to.centerY}, ${to.left} ${to.centerY}`,
            active,
          },
        ]
      })
    })

    const outputLines = layerStackOrder.flatMap((layer) => {
      const from = positions[layer.id]
      if (!from) {
        return []
      }

      const relatedOutputs = outputs
        .filter((output) => (outputRelationships[output.id]?.layerIds ?? []).includes(layer.id))
        .map((output) => output.id)

      return relatedOutputs.flatMap((outputId) => {
        const to = positions[outputId]
        if (!to) {
          return []
        }

        const active = activeRelationship.layerIds.includes(layer.id) && activeRelationship.outputIds.includes(outputId)

        return [
          {
            key: `${layer.id}-${outputId}`,
            d: `M ${from.right} ${from.centerY} C ${from.right + 24} ${from.centerY}, ${to.left - 30} ${to.centerY}, ${to.left} ${to.centerY}`,
            active,
          },
        ]
      })
    })

    return [...layerLines, ...outputLines]
  }, [activeRelationship, outputRelationships, positions])

  const isActive = (kind: keyof Relationship, id: string) => activeRelationship[kind].includes(id)

  const getLocalizedDisplay = (item: DiagramItem) => {
    switch (item.kind) {
      case 'input': {
        const index = inputs.findIndex((entry) => entry.id === item.id)
        return localizedInputs[index] ?? { title: item.title, detail: item.detail }
      }
      case 'layer': {
        const index = layerStackOrder.findIndex((entry) => entry.id === item.id)
        return localizedLayers[index] ?? { title: item.title, detail: item.detail, purpose: item.purpose ?? '', value: item.value ?? '', outcome: item.outcome ?? '' }
      }
      case 'output': {
        const index = outputs.findIndex((entry) => entry.id === item.id)
        return localizedOutputs[index] ?? { title: item.title, detail: item.detail }
      }
      case 'capability': {
        const index = capabilities.findIndex((entry) => entry.id === item.id)
        return localizedCapabilities[index] ?? { title: item.title, detail: item.detail }
      }
      default:
        return { title: item.title, detail: item.detail }
    }
  }

  const handleLayerEnter = (layer: DiagramItem, element: HTMLButtonElement) => {
    setHoveredId(layer.id)

    const rect = element.getBoundingClientRect()
    const width = 340
    const desiredX = rect.right + 14
    const clampedX = Math.max(16, Math.min(desiredX, window.innerWidth - width - 16))
    const clampedY = Math.max(24, Math.min(rect.top + rect.height * 0.5 - 110, window.innerHeight - 240))

    setTooltip({ layer, x: clampedX, y: clampedY })
  }

  return (
    <div className={`knowledge-architecture stage-${scrollStage}`} ref={wrapperRef}>
      <div className="knowledge-frame">
        <div className="knowledge-zones" aria-hidden="true">
          <span>{content.zones[0]}</span>
          <span>{content.zones[1]}</span>
          <span>{content.zones[2]}</span>
        </div>

        <svg className="knowledge-connections" viewBox={`0 0 ${Math.max(1, wrapperRef.current?.clientWidth ?? 1)} ${Math.max(1, wrapperRef.current?.clientHeight ?? 1)}`} preserveAspectRatio="none" aria-hidden="true">
          {connectorPaths.map((path) => (
            <path key={path.key} d={path.d} className={path.active ? 'connector-path connector-path-active' : 'connector-path'} />
          ))}
        </svg>

        <div className="knowledge-grid" onMouseLeave={() => { setHoveredId(null); setTooltip(null) }}>
          <div className="knowledge-column knowledge-column-inputs">
            {inputs.map((input, index) => (
              <button
                key={input.id}
                type="button"
                ref={(element) => {
                  itemRefs.current[input.id] = element
                }}
                className={isActive('inputIds', input.id) ? 'knowledge-card is-active' : 'knowledge-card'}
                onMouseEnter={() => setHoveredId(input.id)}
                onBlur={() => setHoveredId(null)}
                onFocus={() => setHoveredId(input.id)}
              >
                {input.icon ? <input.icon size={16} strokeWidth={1.9} aria-hidden="true" /> : null}
                <span>{localizedInputs[index]?.title ?? input.title}</span>
              </button>
            ))}
          </div>

          <div className="knowledge-column knowledge-column-center">
            <div className="knowledge-layer-stack">
              <div className="knowledge-layer-header">
                <h2>{content.header.title}</h2>
                <p>{content.header.description}</p>
              </div>

              {layerStackOrder.map((layer, index) => (
                <button
                  key={layer.id}
                  type="button"
                  ref={(element) => {
                    itemRefs.current[layer.id] = element
                  }}
                  className={isActive('layerIds', layer.id) ? 'knowledge-layer is-active' : 'knowledge-layer'}
                  onMouseEnter={(event) => handleLayerEnter(layer, event.currentTarget)}
                  onBlur={() => setTooltip(null)}
                  onFocus={(event) => handleLayerEnter(layer, event.currentTarget)}
                >
                  <span>{localizedLayers[index]?.title ?? layer.title}</span>
                </button>
              ))}
            </div>

            <div className="knowledge-capabilities">
              {capabilities.map((capability, index) => (
                <button
                  key={capability.id}
                  type="button"
                  ref={(element) => {
                    itemRefs.current[capability.id] = element
                  }}
                  className={isActive('capabilityIds', capability.id) ? 'capability-chip is-active' : 'capability-chip'}
                  onMouseEnter={() => setHoveredId(capability.id)}
                  onBlur={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(capability.id)}
                >
                  {localizedCapabilities[index]?.title ?? capability.title}
                </button>
              ))}
            </div>
          </div>

          <div className="knowledge-column knowledge-column-outputs">
            {outputs.map((output, index) => (
              <button
                key={output.id}
                type="button"
                ref={(element) => {
                  itemRefs.current[output.id] = element
                }}
                className={isActive('outputIds', output.id) ? 'knowledge-card is-active' : 'knowledge-card'}
                onMouseEnter={() => setHoveredId(output.id)}
                onBlur={() => setHoveredId(null)}
                onFocus={() => setHoveredId(output.id)}
              >
                <span>{localizedOutputs[index]?.title ?? output.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {tooltip && tooltip.layer.purpose && tooltip.layer.value && tooltip.layer.outcome && (
        <div className="layer-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          <strong>{tooltip.layer.title}</strong>
          <p><span>{content.detailLabels.purpose}</span>{tooltip.layer.purpose}</p>
          <p><span>{content.detailLabels.value}</span>{tooltip.layer.value}</p>
          <p><span>{content.detailLabels.outcome}</span>{tooltip.layer.outcome}</p>
        </div>
      )}

      <article className="knowledge-detail-panel" aria-live="polite">
        {(() => {
          const displayItem = getLocalizedDisplay(activeItem)
          return (
            <>
              <span className="knowledge-detail-kind">{content.itemKinds[activeItem.kind]}</span>
              <h3>{displayItem.title}</h3>
              <p>{displayItem.detail}</p>
            </>
          )
        })()}
      </article>
    </div>
  )
}

export default KnowledgeGraph
