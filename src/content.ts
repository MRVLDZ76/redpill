import type { ComponentType } from 'react'
import { Layers3, Network, Share2, Workflow } from 'lucide-react'

export type Locale = 'en' | 'fr' | 'es'

export const supportedLocales: Locale[] = ['en', 'fr', 'es']

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
  es: 'ES',
}

type ServicePillarCopy = {
  title: string
  problem: string
  approach: string
  outcome: string
  impact: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
}

type AppContent = {
  meta: {
    title: string
    description: string
  }
  nav: {
    approach: string
    services: string
    insights: string
    contact: string
    sendMessage: string
  }
  theme: {
    light: string
    dark: string
    aria: string
  }
  hero: {
    eyebrow: string
    title: string
    intro: string
    detail: string
    primary: string
    secondary: string
    rotatingLabel: string
    rotatingStatements: string[]
  }
  clients: {
    eyebrow: string
    title: string
    subtitle: string
  }
  failure: {
    eyebrow: string
    title: string
    items: Array<{ title: string; text: string }>
    summary: string
  }
  approach: {
    eyebrow: string
    title: string
    steps: Array<{ title: string; text: string }>
  }
  gap: {
    eyebrow: string
    title: string
    paragraphs: string[]
    cta: string
    nodes: {
      experimental: string
      foundation: string
      enterprise: string
    }
  }
  services: {
    eyebrow: string
    title: string
    items: ServicePillarCopy[]
    labels: {
      problem: string
      approach: string
      outcome: string
      impact: string
    }
  }
  redPill: {
    eyebrow: string
    title: string
    paragraphs: string[]
  }
  insights: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ title: string; text: string }>
    cta: string
  }
  contact: {
    eyebrow: string
    title: string
    intro: string
    fields: {
      name: string
      company: string
      email: string
      subject: string
      message: string
      consent: string
    }
    submit: string
    linkedin: string
    messages: {
      configMissing: string
      spam: string
      fastSubmit: string
      cooldown: string
      sending: string
      success: string
      error: string
    }
  }
  footer: {
    tagline: string
    address: string[]
    links: string[]
  }
}

type KnowledgeGraphContent = {
  zones: [string, string, string]
  header: {
    title: string
    description: string
  }
  detailLabels: {
    purpose: string
    value: string
    outcome: string
  }
  itemKinds: Record<'input' | 'layer' | 'output' | 'capability', string>
  inputs: Array<{ title: string; detail: string }>
  layers: Array<{ title: string; detail: string; purpose: string; value: string; outcome: string }>
  outputs: Array<{ title: string; detail: string }>
  capabilities: Array<{ title: string; detail: string }>
}

export const appCopy: Record<Locale, AppContent> = {
  en: {
    meta: {
      title: 'Red Pill Software | Enterprise Intelligence Architecture for Reliable AI',
      description:
        'From fragmented enterprise data to reliable AI outcomes through semantic architecture, knowledge graphs, and ontology engineering.',
    },
    nav: {
      approach: 'Approach',
      services: 'Services',
      insights: 'Insights',
      contact: 'Contact',
      sendMessage: 'Send a Message',
    },
    theme: {
      light: 'Light',
      dark: 'Dark',
      aria: 'Toggle color theme',
    },
    hero: {
      eyebrow: 'The Red Pill',
      title: 'Most AI projects fail before the model is chosen.',
      intro: 'We help organizations build the knowledge infrastructure that makes AI reliable, explainable, and valuable.',
      detail: 'Through ontology engineering, knowledge graphs, semantic architecture, and enterprise data engineering.',
      primary: 'Send a Message',
      secondary: 'Explore Our Approach',
      rotatingLabel: 'Strategic thesis',
      rotatingStatements: [
        'AI is not the foundation. Knowledge is.',
        'Most organizations need architecture before agents.',
        'Better models do not solve fragmented knowledge.',
        'Enterprise AI begins with shared meaning.',
        'Your knowledge graph is more important than your chatbot.',
        'Structure precedes intelligence.',
      ],
    },
    clients: {
      eyebrow: 'Enterprise Partners',
      title: 'Built for organizations that demand reliability.',
      subtitle: 'Financial services, technology, healthcare, and manufacturing leaders trust Red Pill to architect AI systems that work.',
    },
    failure: {
      eyebrow: 'Why AI Projects Fail',
      title: 'Most enterprise AI programs underperform for structural reasons, not model reasons.',
      items: [
        {
          title: 'Lack of Shared Meaning',
          text: 'Different teams describe the same entities, events, and outcomes in different ways, which breaks alignment before AI starts.',
        },
        {
          title: 'Fragmented Knowledge',
          text: 'Critical context remains trapped in documents, systems, and conversations that never converge into a usable architecture.',
        },
        {
          title: 'Premature AI Adoption',
          text: 'Organizations deploy models and assistants before building the semantic and data foundations required for reliable outcomes.',
        },
      ],
      summary:
        'Red Pill Software solves these challenges through enterprise knowledge architecture, semantic systems design, and graph-grounded intelligence foundations.',
    },
    approach: {
      eyebrow: 'Core positioning',
      title: 'AI performs at the level of the architecture beneath it.',
      steps: [
        {
          title: 'Clarify enterprise meaning',
          text: 'We identify the concepts, entities, and decision structures that actually drive operations, not just the tables that store them.',
        },
        {
          title: 'Connect fragmented knowledge',
          text: 'We align documents, systems, processes, and data into a semantic foundation that can support search, reasoning, and automation.',
        },
        {
          title: 'Deploy usable intelligence',
          text: 'We turn that foundation into enterprise search, assistants, agentic workflows, and decision support that people can trust.',
        },
      ],
    },
    gap: {
      eyebrow: 'The cognitive gap',
      title:
        'If AI has disappointed your organization, you are likely deploying experimental models instead of enterprise architecture.',
      paragraphs: [
        'Most enterprise AI initiatives stall in the proof-of-concept stage. This is not a failure of artificial intelligence. It is a failure of information architecture. When advanced models are connected to fragmented databases, siloed spreadsheets, and inconsistent terminology, they hallucinate, fail to retrieve, and lose executive trust.',
        'There is a predictable path forward. By shifting your focus from the model to the semantic foundation - connecting your data through robust ontologies and knowledge graphs - your AI transitions from an unpredictable novelty into a reliable, deterministic asset.',
      ],
      cta: 'Bridge the Enterprise Gap',
      nodes: {
        experimental: 'Experimental',
        foundation: 'Semantic',
        enterprise: 'Enterprise',
      },
    },
    services: {
      eyebrow: 'Services',
      title: 'Consulting capabilities built for enterprise-scale transformation programs.',
      labels: {
        problem: 'Problem',
        approach: 'Approach',
        outcome: 'Outcome',
        impact: 'Business impact',
      },
      items: [
        {
          title: 'Enterprise Knowledge Architecture',
          icon: Network,
          problem: 'Terminology, ownership, and system boundaries are inconsistent across functions.',
          approach: 'Define domain models, canonical concepts, and governance patterns for enterprise-wide alignment.',
          outcome: 'A coherent semantic operating layer spanning teams, tools, and data products.',
          impact: 'Reduced ambiguity, faster execution, and higher confidence in strategic decisions.',
        },
        {
          title: 'Knowledge Graph Engineering',
          icon: Share2,
          problem: 'Business context is dispersed across systems with no durable relationship model.',
          approach: 'Model entities, relationships, provenance, and retrieval flows in graph-native systems.',
          outcome: 'Connected enterprise memory supporting discovery, explainability, and reasoning.',
          impact: 'Higher answer quality, stronger context retrieval, and more reliable intelligent applications.',
        },
        {
          title: 'Enterprise Data Engineering',
          icon: Layers3,
          problem: 'Data foundations are brittle, inconsistent, and disconnected from business meaning.',
          approach: 'Build governed ingestion, normalization, lineage, and semantic-ready transformation pipelines.',
          outcome: 'Operationally stable foundations for graph, analytics, search, and AI systems.',
          impact: 'Lower integration friction and a materially lower cost of organizational change.',
        },
        {
          title: 'AI Transformation & Agentic Systems',
          icon: Workflow,
          problem: 'AI initiatives launch before architecture, controls, and enterprise context are mature.',
          approach: 'Sequence transformation around knowledge foundations, orchestration patterns, and governance.',
          outcome: 'Agentic systems and assistants tied to real operating constraints and business outcomes.',
          impact: 'Safer deployment, stronger adoption, and measurable enterprise value from AI.',
        },
      ],
    },
    redPill: {
      eyebrow: 'The Red Pill',
      title: 'The AI industry is focused on models. We focus on understanding.',
      paragraphs: [
        'Most AI failures originate from fragmented knowledge, disconnected systems, inconsistent terminology, and poor information architecture.',
        'Taking the red pill means recognizing that AI is not the foundation. Knowledge is.',
      ],
    },
    insights: {
      eyebrow: 'Featured insights',
      title: 'Thought leadership for data, AI, and enterprise architecture teams.',
      intro: 'Clear perspectives for CTOs, CIOs, CDOs, and enterprise architects building beyond pilots.',
      items: [
        {
          title: 'Why Most Enterprise AI Projects Fail',
          text: 'Executive-level framing on why architecture and shared meaning determine whether AI becomes operational or ornamental.',
        },
        {
          title: 'Knowledge Graphs for Executives',
          text: 'Executive-level framing on how ontology, graph, governance, and semantic systems create measurable AI outcomes.',
        },
        {
          title: 'Ontology Engineering Explained',
          text: 'Executive-level framing on building durable semantic models that align teams, systems, and business language.',
        },
        {
          title: 'The Semantic Layer for Enterprise AI',
          text: 'Executive-level framing on how semantic layers help AI retrieve, reason, and respond with reliable context.',
        },
        {
          title: 'Preparing Organizations for Agentic Systems',
          text: 'Executive-level framing on governance, operating constraints, and architecture readiness before agent rollout.',
        },
      ],
      cta: 'Discuss this topic',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Let\'s discuss your AI transformation strategy.',
      intro: 'If the initiative is serious, the first conversation should focus on knowledge architecture, governance, and operating constraints before model selection.',
      fields: {
        name: 'Name',
        company: 'Company',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        consent: 'I confirm this is an actual business inquiry and I want Red Pill Software to contact me.',
      },
      submit: 'Send Message',
      linkedin: 'Connect on LinkedIn',
      messages: {
        configMissing: 'Email service is not configured yet. Add EmailJS keys to environment variables.',
        spam: 'Submission blocked.',
        fastSubmit: 'Please take a moment before submitting the form.',
        cooldown: 'Please wait one minute before sending another message.',
        sending: 'Sending...',
        success: 'Message sent successfully. We will follow up shortly.',
        error: 'Message could not be sent. Please retry in a moment.',
      },
    },
    footer: {
      tagline: 'Knowledge Before AI.',
      address: ['7901 4TH ST N', 'STE 300', 'ST. PETERSBURG, FL 33702'],
      links: ['Approach', 'Services', 'Insights', 'Contact', 'LinkedIn'],
    },
  },
  fr: {
    meta: {
      title: 'Red Pill Software | Architecture d\'intelligence d\'entreprise pour une IA fiable',
      description:
        'Des données d\'entreprise fragmentées vers des résultats IA fiables grâce à l\'architecture sémantique, aux ontologies et aux graphes de connaissances.',
    },
    nav: {
      approach: 'Approche',
      services: 'Services',
      insights: 'Analyses',
      contact: 'Contact',
      sendMessage: 'Envoyer un message',
    },
    theme: {
      light: 'Clair',
      dark: 'Sombre',
      aria: 'Basculer le thème couleur',
    },
    hero: {
      eyebrow: 'La pilule rouge',
      title: 'La plupart des projets IA échouent avant même le choix du modèle.',
      intro: 'Nous aidons les organisations à bâtir l\'infrastructure de connaissance qui rend l\'IA fiable, explicable et utile.',
      detail: 'Grâce à l\'ingénierie d\'ontologies, aux graphes de connaissances, à l\'architecture sémantique et à l\'ingénierie des données d\'entreprise.',
      primary: 'Envoyer un message',
      secondary: 'Découvrir notre approche',
      rotatingLabel: 'Thèse stratégique',
      rotatingStatements: [
        'L\'IA n\'est pas la base. La connaissance l\'est.',
        'La plupart des organisations ont besoin d\'architecture avant les agents.',
        'De meilleurs modèles ne résolvent pas une connaissance fragmentée.',
        'L\'IA d\'entreprise commence par un sens partagé.',
        'Votre graphe de connaissances compte plus que votre chatbot.',
        'La structure précède l\'intelligence.',
      ],
    },
    clients: {
      eyebrow: 'Partenaires Entreprise',
      title: 'Construit pour les organisations qui exigent la fiabilité.',
      subtitle: 'Les leaders des services financiers, de la technologie, de la santé et de la fabrication font confiance à Red Pill pour concevoir des systèmes IA qui fonctionnent.',
    },
    failure: {
      eyebrow: 'Pourquoi les projets IA échouent',
      title: 'La plupart des programmes IA d\'entreprise sous-performent pour des raisons structurelles, pas pour des raisons de modèle.',
      items: [
        {
          title: 'Absence de sens partagé',
          text: 'Différentes équipes décrivent les mêmes entités, événements et résultats de façons différentes, ce qui casse l\'alignement avant même l\'IA.',
        },
        {
          title: 'Connaissance fragmentée',
          text: 'Le contexte critique reste piégé dans des documents, systèmes et conversations qui ne convergent jamais vers une architecture exploitable.',
        },
        {
          title: 'Adoption IA prématurée',
          text: 'Les organisations déploient des modèles et assistants avant d\'avoir construit les fondations sémantiques et data nécessaires à des résultats fiables.',
        },
      ],
      summary:
        'Red Pill Software résout ces défis grâce à l\'architecture de connaissance d\'entreprise, au design de systèmes sémantiques et à des fondations d\'intelligence centrées sur les graphes.',
    },
    approach: {
      eyebrow: 'Positionnement central',
      title: 'L\'IA performe au niveau de l\'architecture qui la sous-tend.',
      steps: [
        {
          title: 'Clarifier le sens métier',
          text: 'Nous identifions les concepts, entités et structures de décision qui pilotent réellement l\'opération, pas seulement les tables qui les stockent.',
        },
        {
          title: 'Relier la connaissance fragmentée',
          text: 'Nous alignons documents, systèmes, processus et données dans une base sémantique capable de supporter la recherche, le raisonnement et l\'automatisation.',
        },
        {
          title: 'Déployer une intelligence utilisable',
          text: 'Nous transformons cette base en recherche d\'entreprise, assistants, workflows agentiques et aide à la décision dignes de confiance.',
        },
      ],
    },
    gap: {
      eyebrow: 'L\'écart cognitif',
      title:
        'Si l\'IA a déçu votre organisation, vous déployez probablement des modèles expérimentaux au lieu d\'une architecture d\'entreprise.',
      paragraphs: [
        'La plupart des initiatives IA d\'entreprise s\'arrêtent au stade du proof-of-concept. Ce n\'est pas un échec de l\'intelligence artificielle. C\'est un échec de l\'architecture de l\'information. Lorsque des modèles avancés sont connectés à des bases fragmentées, des tableurs isolés et une terminologie incohérente, ils hallucinent, ne retrouvent pas le bon contexte et perdent la confiance des décideurs.',
        'La voie à suivre est prévisible. En déplaçant l\'attention du modèle vers la fondation sémantique - en reliant vos données via des ontologies robustes et des graphes de connaissances - votre IA passe d\'une nouveauté imprévisible à un actif fiable et déterministe.',
      ],
      cta: 'Combler l\'écart d\'entreprise',
      nodes: {
        experimental: 'Expérimental',
        foundation: 'Fondation',
        enterprise: 'Entreprise',
      },
    },
    services: {
      eyebrow: 'Services',
      title: 'Des capacités de conseil conçues pour des programmes de transformation à l\'échelle de l\'entreprise.',
      labels: {
        problem: 'Problème',
        approach: 'Approche',
        outcome: 'Résultat',
        impact: 'Impact métier',
      },
      items: [
        {
          title: 'Architecture de connaissance d\'entreprise',
          icon: Network,
          problem: 'La terminologie, la responsabilité et les frontières systèmes sont incohérentes entre les fonctions.',
          approach: 'Définir des modèles de domaine, des concepts canoniques et des règles de gouvernance pour aligner l\'entreprise.',
          outcome: 'Une couche sémantique cohérente entre équipes, outils et produits data.',
          impact: 'Moins d\'ambiguïté, plus de vitesse d\'exécution et plus de confiance dans les décisions stratégiques.',
        },
        {
          title: 'Ingénierie des graphes de connaissances',
          icon: Share2,
          problem: 'Le contexte métier est dispersé entre des systèmes sans modèle de relations durable.',
          approach: 'Modéliser les entités, relations, provenance et flux de retrieval dans des systèmes natifs graphe.',
          outcome: 'Une mémoire d\'entreprise connectée pour la découverte, l\'explicabilité et le raisonnement.',
          impact: 'Des réponses plus fiables, un meilleur retrieval de contexte et des applications intelligentes plus robustes.',
        },
        {
          title: 'Ingénierie des données d\'entreprise',
          icon: Layers3,
          problem: 'Les fondations data sont fragiles, incohérentes et déconnectées du sens métier.',
          approach: 'Construire des pipelines gouvernés d\'ingestion, de normalisation, de traçabilité et de transformation sémantique.',
          outcome: 'Des fondations stables pour les graphes, l\'analytique, la recherche et les systèmes IA.',
          impact: 'Moins de friction d\'intégration et un coût de changement organisationnel nettement réduit.',
        },
        {
          title: 'Transformation IA et systèmes agentiques',
          icon: Workflow,
          problem: 'Les initiatives IA démarrent avant que l\'architecture, les contrôles et le contexte d\'entreprise soient mûrs.',
          approach: 'Orchestrer la transformation autour des fondations de connaissance, des schémas d\'orchestration et de la gouvernance.',
          outcome: 'Des systèmes agentiques et assistants ancrés dans des contraintes réelles et des objectifs métiers.',
          impact: 'Déploiement plus sûr, meilleure adoption et valeur d\'entreprise mesurable.',
        },
      ],
    },
    redPill: {
      eyebrow: 'La pilule rouge',
      title: 'L\'industrie de l\'IA se concentre sur les modèles. Nous nous concentrons sur la compréhension.',
      paragraphs: [
        'La plupart des échecs IA proviennent d\'une connaissance fragmentée, de systèmes déconnectés, d\'une terminologie incohérente et d\'une mauvaise architecture de l\'information.',
        'Prendre la pilule rouge, c\'est reconnaître que l\'IA n\'est pas la fondation. La connaissance l\'est.',
      ],
    },
    insights: {
      eyebrow: 'Analyses à la une',
      title: 'Une pensée de haut niveau pour les équipes data, IA et architecture d\'entreprise.',
      intro: 'Des perspectives claires pour les CTO, CIO, CDO et architectes d\'entreprise qui construisent au-delà des pilotes.',
      items: [
        {
          title: 'Pourquoi la plupart des projets IA d\'entreprise échouent',
          text: 'Un cadrage exécutif sur le fait que l\'architecture et le sens partagé déterminent si l\'IA devient opérationnelle ou décorative.',
        },
        {
          title: 'Les graphes de connaissances pour les dirigeants',
          text: 'Un cadrage exécutif sur la façon dont l\'ontologie, le graphe, la gouvernance et le sémantique produisent des résultats IA mesurables.',
        },
        {
          title: 'L\'ingénierie d\'ontologie expliquée',
          text: 'Un cadrage exécutif sur la construction de modèles sémantiques durables qui alignent équipes, systèmes et langage métier.',
        },
        {
          title: 'La couche sémantique pour l\'IA d\'entreprise',
          text: 'Un cadrage exécutif sur la manière dont les couches sémantiques aident l\'IA à retrouver, raisonner et répondre avec un contexte fiable.',
        },
        {
          title: 'Préparer les organisations aux systèmes agentiques',
          text: 'Un cadrage exécutif sur la gouvernance, les contraintes d\'exploitation et la maturité architecturale avant le déploiement d\'agents.',
        },
      ],
      cta: 'Discuter de ce sujet',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Discutons de votre stratégie de transformation IA.',
      intro: 'Si l\'initiative est sérieuse, la première conversation doit porter sur l\'architecture de connaissance, la gouvernance et les contraintes d\'exploitation avant le choix du modèle.',
      fields: {
        name: 'Nom',
        company: 'Entreprise',
        email: 'Email',
        subject: 'Sujet',
        message: 'Message',
        consent: 'Je confirme qu\'il s\'agit d\'une demande professionnelle réelle et que je souhaite être contacté par Red Pill Software.',
      },
      submit: 'Envoyer le message',
      linkedin: 'Se connecter sur LinkedIn',
      messages: {
        configMissing: 'Le service email n\'est pas encore configuré. Ajoutez les clés EmailJS aux variables d\'environnement.',
        spam: 'Envoi bloqué.',
        fastSubmit: 'Veuillez prendre un instant avant d\'envoyer le formulaire.',
        cooldown: 'Veuillez attendre une minute avant d\'envoyer un autre message.',
        sending: 'Envoi...',
        success: 'Message envoyé avec succès. Nous vous répondrons rapidement.',
        error: 'Le message n\'a pas pu être envoyé. Veuillez réessayer dans un instant.',
      },
    },
    footer: {
      tagline: 'La connaissance avant l\'IA.',
      address: ['7901 4TH ST N', 'STE 300', 'ST. PETERSBURG, FL 33702'],
      links: ['Approche', 'Services', 'Analyses', 'Contact', 'LinkedIn'],
    },
  },
  es: {
    meta: {
      title: 'Red Pill Software | Arquitectura de inteligencia empresarial para IA confiable',
      description:
        'De datos empresariales fragmentados a resultados de IA confiables mediante arquitectura semántica, ontologías e ingeniería de grafos de conocimiento.',
    },
    nav: {
      approach: 'Enfoque',
      services: 'Servicios',
      insights: 'Ideas',
      contact: 'Contacto',
      sendMessage: 'Enviar mensaje',
    },
    theme: {
      light: 'Claro',
      dark: 'Oscuro',
      aria: 'Cambiar tema de color',
    },
    hero: {
      eyebrow: 'La píldora roja',
      title: 'La mayoría de los proyectos de IA fallan antes de elegir el modelo.',
      intro: 'Ayudamos a las organizaciones a construir la infraestructura de conocimiento que hace que la IA sea confiable, explicable y valiosa.',
      detail: 'A través de ingeniería de ontologías, grafos de conocimiento, arquitectura semántica e ingeniería de datos empresariales.',
      primary: 'Enviar mensaje',
      secondary: 'Explorar nuestro enfoque',
      rotatingLabel: 'Tesis estratégica',
      rotatingStatements: [
        'La IA no es la base. El conocimiento sí.',
        'La mayoría de las organizaciones necesitan arquitectura antes que agentes.',
        'Mejores modelos no resuelven conocimiento fragmentado.',
        'La IA empresarial comienza con significado compartido.',
        'Tu grafo de conocimiento importa más que tu chatbot.',
        'La estructura precede a la inteligencia.',
      ],
    },
    clients: {
      eyebrow: 'Socios Empresariales',
      title: 'Creado para organizaciones que exigen confiabilidad.',
      subtitle: 'Los líderes de servicios financieros, tecnología, salud y fabricación confían en Red Pill para arquitecturar sistemas de IA que funcionan.',
    },
    failure: {
      eyebrow: 'Por qué fallan los proyectos de IA',
      title: 'La mayoría de los programas de IA empresarial rinden por debajo de lo esperado por razones estructurales, no por el modelo.',
      items: [
        {
          title: 'Falta de significado compartido',
          text: 'Distintos equipos describen las mismas entidades, eventos y resultados de maneras distintas, lo que rompe la alineación antes de que la IA empiece.',
        },
        {
          title: 'Conocimiento fragmentado',
          text: 'El contexto crítico permanece atrapado en documentos, sistemas y conversaciones que nunca convergen en una arquitectura utilizable.',
        },
        {
          title: 'Adopción prematura de IA',
          text: 'Las organizaciones despliegan modelos y asistentes antes de construir las bases semánticas y de datos necesarias para resultados fiables.',
        },
      ],
      summary:
        'Red Pill Software resuelve estos desafíos mediante arquitectura de conocimiento empresarial, diseño de sistemas semánticos y bases de inteligencia centradas en grafos.',
    },
    approach: {
      eyebrow: 'Posicionamiento central',
      title: 'La IA funciona al nivel de la arquitectura que la sostiene.',
      steps: [
        {
          title: 'Aclarar el significado empresarial',
          text: 'Identificamos los conceptos, entidades y estructuras de decisión que realmente impulsan la operación, no solo las tablas que los almacenan.',
        },
        {
          title: 'Conectar el conocimiento fragmentado',
          text: 'Alineamos documentos, sistemas, procesos y datos en una base semántica que soporte búsqueda, razonamiento y automatización.',
        },
        {
          title: 'Desplegar inteligencia utilizable',
          text: 'Convertimos esa base en búsqueda empresarial, asistentes, flujos agenticos y soporte de decisión en los que se pueda confiar.',
        },
      ],
    },
    gap: {
      eyebrow: 'La brecha cognitiva',
      title:
        'Si la IA ha decepcionado a tu organización, probablemente estás desplegando modelos experimentales en lugar de arquitectura empresarial.',
      paragraphs: [
        'La mayoría de las iniciativas de IA empresarial se quedan en la etapa de proof-of-concept. Esto no es un fallo de la inteligencia artificial. Es un fallo de la arquitectura de la información. Cuando modelos avanzados se conectan a bases de datos fragmentadas, hojas de cálculo aisladas y terminología inconsistente, alucinan, no recuperan el contexto correcto y pierden la confianza ejecutiva.',
        'Hay un camino predecible. Al cambiar el foco del modelo a la base semántica - conectando tus datos mediante ontologías robustas y grafos de conocimiento - tu IA pasa de ser una novedad impredecible a un activo confiable y determinista.',
      ],
      cta: 'Cerrar la brecha empresarial',
      nodes: {
        experimental: 'Experimental',
        foundation: 'Base',
        enterprise: 'Empresa',
      },
    },
    services: {
      eyebrow: 'Servicios',
      title: 'Capacidades de consultoría diseñadas para programas de transformación a escala empresarial.',
      labels: {
        problem: 'Problema',
        approach: 'Enfoque',
        outcome: 'Resultado',
        impact: 'Impacto en negocio',
      },
      items: [
        {
          title: 'Arquitectura de conocimiento empresarial',
          icon: Network,
          problem: 'La terminología, la responsabilidad y los límites de sistema son incoherentes entre funciones.',
          approach: 'Definir modelos de dominio, conceptos canónicos y patrones de gobernanza para alinear la empresa.',
          outcome: 'Una capa semántica coherente entre equipos, herramientas y productos de datos.',
          impact: 'Menos ambigüedad, más velocidad de ejecución y más confianza en las decisiones estratégicas.',
        },
        {
          title: 'Ingeniería de grafos de conocimiento',
          icon: Share2,
          problem: 'El contexto de negocio está disperso entre sistemas sin un modelo duradero de relaciones.',
          approach: 'Modelar entidades, relaciones, procedencia y flujos de retrieval en sistemas nativos de grafo.',
          outcome: 'Una memoria empresarial conectada para descubrimiento, explicabilidad y razonamiento.',
          impact: 'Respuestas de mayor calidad, mejor recuperación de contexto y aplicaciones inteligentes más fiables.',
        },
        {
          title: 'Ingeniería de datos empresariales',
          icon: Layers3,
          problem: 'Las bases de datos son frágiles, inconsistentes y están desconectadas del significado de negocio.',
          approach: 'Construir pipelines gobernados de ingesta, normalización, linaje y transformación listas para lo semántico.',
          outcome: 'Bases estables para grafos, analítica, búsqueda y sistemas de IA.',
          impact: 'Menor fricción de integración y un coste de cambio organizativo mucho más bajo.',
        },
        {
          title: 'Transformación de IA y sistemas agenticos',
          icon: Workflow,
          problem: 'Las iniciativas de IA se lanzan antes de que la arquitectura, los controles y el contexto empresarial estén maduros.',
          approach: 'Secuenciar la transformación alrededor de las bases de conocimiento, patrones de orquestación y gobernanza.',
          outcome: 'Sistemas agenticos y asistentes ligados a restricciones reales y a resultados de negocio.',
          impact: 'Despliegue más seguro, mayor adopción y valor empresarial medible.',
        },
      ],
    },
    redPill: {
      eyebrow: 'La píldora roja',
      title: 'La industria de la IA se enfoca en los modelos. Nosotros nos enfocamos en la comprensión.',
      paragraphs: [
        'La mayoría de los fallos de IA provienen de conocimiento fragmentado, sistemas desconectados, terminología inconsistente y mala arquitectura de información.',
        'Tomar la píldora roja significa reconocer que la IA no es la base. El conocimiento sí lo es.',
      ],
    },
    insights: {
      eyebrow: 'Ideas destacadas',
      title: 'Liderazgo de pensamiento para equipos de datos, IA y arquitectura empresarial.',
      intro: 'Perspectivas claras para CTOs, CIOs, CDOs y arquitectos empresariales que construyen más allá de los pilotos.',
      items: [
        {
          title: 'Por qué fallan la mayoría de los proyectos de IA empresarial',
          text: 'Un marco ejecutivo sobre por qué la arquitectura y el significado compartido determinan si la IA se vuelve operativa o decorativa.',
        },
        {
          title: 'Grafos de conocimiento para ejecutivos',
          text: 'Un marco ejecutivo sobre cómo ontología, grafo, gobernanza y sistemas semánticos generan resultados medibles de IA.',
        },
        {
          title: 'Ingeniería de ontologías explicada',
          text: 'Un marco ejecutivo sobre cómo construir modelos semánticos duraderos que alineen equipos, sistemas y lenguaje de negocio.',
        },
        {
          title: 'La capa semántica para IA empresarial',
          text: 'Un marco ejecutivo sobre cómo las capas semánticas ayudan a la IA a recuperar, razonar y responder con contexto fiable.',
        },
        {
          title: 'Preparar a las organizaciones para sistemas agenticos',
          text: 'Un marco ejecutivo sobre gobernanza, restricciones operativas y madurez arquitectónica antes de desplegar agentes.',
        },
      ],
      cta: 'Hablar de este tema',
    },
    contact: {
      eyebrow: 'Contacto',
      title: 'Hablemos de tu estrategia de transformación de IA.',
      intro: 'Si la iniciativa es seria, la primera conversación debe centrarse en arquitectura de conocimiento, gobernanza y restricciones operativas antes de elegir el modelo.',
      fields: {
        name: 'Nombre',
        company: 'Empresa',
        email: 'Correo',
        subject: 'Asunto',
        message: 'Mensaje',
        consent: 'Confirmo que esta es una consulta empresarial real y quiero que Red Pill Software me contacte.',
      },
      submit: 'Enviar mensaje',
      linkedin: 'Conectar en LinkedIn',
      messages: {
        configMissing: 'El servicio de correo aún no está configurado. Añade las claves de EmailJS a las variables de entorno.',
        spam: 'Envío bloqueado.',
        fastSubmit: 'Espera un momento antes de enviar el formulario.',
        cooldown: 'Espera un minuto antes de enviar otro mensaje.',
        sending: 'Enviando...',
        success: 'Mensaje enviado correctamente. Te contactaremos pronto.',
        error: 'No se pudo enviar el mensaje. Inténtalo de nuevo en un momento.',
      },
    },
    footer: {
      tagline: 'Conocimiento antes que IA.',
      address: ['7901 4TH ST N', 'STE 300', 'ST. PETERSBURG, FL 33702'],
      links: ['Enfoque', 'Servicios', 'Ideas', 'Contacto', 'LinkedIn'],
    },
  },
}

export const knowledgeGraphCopy: Record<Locale, KnowledgeGraphContent> = {
  en: {
    zones: ['Inputs', 'Knowledge Layer', 'AI Applications'],
    header: {
      title: 'Knowledge Layer',
      description: 'The architecture that turns fragmented enterprise information into deployable intelligence.',
    },
    detailLabels: {
      purpose: 'Purpose',
      value: 'Business value',
      outcome: 'Enterprise outcome',
    },
    itemKinds: {
      input: 'input',
      layer: 'layer',
      output: 'output',
      capability: 'capability',
    },
    inputs: [
      { title: 'Databases', detail: 'Structured records, operational systems, and enterprise data stores.' },
      { title: 'Documents', detail: 'Policies, contracts, specifications, and unstructured operational knowledge.' },
      { title: 'Emails', detail: 'Institutional memory and decision context captured in communication trails.' },
      { title: 'APIs', detail: 'Cross-system interfaces exposing entities, events, and process state.' },
      { title: 'CRM', detail: 'Customer and account context that must align with enterprise ontology.' },
      { title: 'ERP', detail: 'Core operational and financial systems with high-value business semantics.' },
      { title: 'Applications', detail: 'Line-of-business platforms with fragmented but critical operational context.' },
      { title: 'Data Lakes', detail: 'Large repositories requiring semantic curation before enterprise AI usage.' },
    ],
    layers: [
      {
        title: 'Governance',
        detail: 'Ownership, policy, and stewardship controls for trusted enterprise knowledge.',
        purpose: 'Establish accountability and control over enterprise knowledge assets.',
        value: 'Increases trust, compliance confidence, and adoption readiness.',
        outcome: 'AI systems operate within defined operational and regulatory constraints.',
      },
      {
        title: 'Data Engineering',
        detail: 'Ingestion, normalization, lineage, and integration of fragmented source systems.',
        purpose: 'Transform fragmented source data into reliable, usable flows.',
        value: 'Improves interoperability and reduces downstream integration failure.',
        outcome: 'Stable enterprise information flows that support scalable AI operations.',
      },
      {
        title: 'Semantic Models',
        detail: 'Shared conceptual structures that map business meaning to technical systems.',
        purpose: 'Translate technical records into consistent business concepts.',
        value: 'Aligns teams, systems, and analysis around shared meaning.',
        outcome: 'Less ambiguity and stronger reasoning quality across AI applications.',
      },
      {
        title: 'Knowledge Graphs',
        detail: 'Connected entity and relationship architecture with provenance and context.',
        purpose: 'Connect entities, events, and dependencies in a queryable graph fabric.',
        value: 'Enhances retrieval, traceability, and explainability.',
        outcome: 'Context-aware AI outputs grounded in enterprise relationships.',
      },
      {
        title: 'Ontologies',
        detail: 'Formal domain models that define enterprise language and conceptual logic.',
        purpose: 'Define durable enterprise meaning and conceptual consistency.',
        value: 'Reduces terminology drift across systems and teams.',
        outcome: 'Reliable semantic alignment for enterprise transformation.',
      },
      {
        title: 'Knowledge Accretion Engine',
        detail: 'Continuous enrichment loops that compound enterprise intelligence over time.',
        purpose: 'Capture feedback and evolve the architecture continuously.',
        value: 'Turns static architecture into a compounding capability.',
        outcome: 'Systems improve with usage instead of degrading with complexity.',
      },
    ],
    outputs: [
      { title: 'AI Assistants', detail: 'Assistants grounded in enterprise context and governance.' },
      { title: 'Enterprise Search', detail: 'Semantic retrieval that understands entities and relationships.' },
      { title: 'Agentic Systems', detail: 'Agents orchestrated with enterprise context and operational controls.' },
      { title: 'Decision Support', detail: 'Reasoning paths connecting facts, policy, and business outcomes.' },
      { title: 'Analytics', detail: 'Business analysis aligned to shared semantic definitions.' },
      { title: 'Workflow Automation', detail: 'Automation informed by entity state, policy, and enterprise rules.' },
      { title: 'Knowledge Discovery', detail: 'Insight surfacing across connected enterprise context.' },
    ],
    capabilities: [
      { title: 'Entity Resolution', detail: 'Resolve duplicate and fragmented identities across systems.' },
      { title: 'Grounded Retrieval', detail: 'Return context with provenance and semantic precision.' },
      { title: 'Taxonomy Design', detail: 'Organize domain terms and hierarchies for enterprise reuse.' },
    ],
  },
  fr: {
    zones: ['Sources', 'Couche de connaissance', 'Applications IA'],
    header: {
      title: 'Couche de connaissance',
      description: 'L\'architecture qui transforme l\'information fragmentée de l\'entreprise en intelligence déployable.',
    },
    detailLabels: {
      purpose: 'Objectif',
      value: 'Valeur métier',
      outcome: 'Résultat entreprise',
    },
    itemKinds: {
      input: 'entrée',
      layer: 'couche',
      output: 'sortie',
      capability: 'capacité',
    },
    inputs: [
      { title: 'Bases de données', detail: 'Données structurées, systèmes opérationnels et dépôts de données d\'entreprise.' },
      { title: 'Documents', detail: 'Politiques, contrats, spécifications et savoir opérationnel non structuré.' },
      { title: 'Emails', detail: 'Mémoire institutionnelle et contexte décisionnel capturés dans les échanges.' },
      { title: 'APIs', detail: 'Interfaces inter-systèmes exposant entités, événements et état des գործընթացs.' },
      { title: 'CRM', detail: 'Contexte client et compte qui doit s\'aligner sur l\'ontologie d\'entreprise.' },
      { title: 'ERP', detail: 'Systèmes opérationnels et financiers au sens métier élevé.' },
      { title: 'Applications', detail: 'Plateformes métiers avec un contexte opérationnel fragmenté mais critique.' },
      { title: 'Lacs de données', detail: 'Grands référentiels qui exigent une curation sémantique avant usage IA.' },
    ],
    layers: [
      {
        title: 'Gouvernance',
        detail: 'Contrôles de propriété, de politique et de stewardship pour une connaissance fiable.',
        purpose: 'Établir la responsabilité et le contrôle des actifs de connaissance.',
        value: 'Renforce la confiance, la conformité et l\'adoption.',
        outcome: 'Les systèmes IA opèrent dans des contraintes opérationnelles et réglementaires définies.',
      },
      {
        title: 'Ingénierie des données',
        detail: 'Ingestion, normalisation, traçabilité et intégration de sources fragmentées.',
        purpose: 'Transformer des données sources fragmentées en flux fiables et utilisables.',
        value: 'Améliore l\'interopérabilité et réduit les échecs d\'intégration.',
        outcome: 'Des flux d\'information stables soutenant des opérations IA évolutives.',
      },
      {
        title: 'Modèles sémantiques',
        detail: 'Structures conceptuelles partagées reliant sens métier et systèmes techniques.',
        purpose: 'Traduire les enregistrements techniques en concepts métier cohérents.',
        value: 'Aligne équipes, systèmes et analyse autour d\'un sens partagé.',
        outcome: 'Moins d\'ambiguïté et une meilleure qualité de raisonnement pour les applications IA.',
      },
      {
        title: 'Graphes de connaissances',
        detail: 'Architecture connectée d\'entités et de relations avec provenance et contexte.',
        purpose: 'Relier entités, événements et dépendances dans un tissu graphe interrogeable.',
        value: 'Améliore le retrieval, la traçabilité et l\'explicabilité.',
        outcome: 'Des sorties IA contextualisées et ancrées dans les relations d\'entreprise.',
      },
      {
        title: 'Ontologies',
        detail: 'Modèles de domaine formels qui définissent le langage et la logique conceptuelle.',
        purpose: 'Définir un sens durable et une cohérence conceptuelle à l\'échelle de l\'entreprise.',
        value: 'Réduit la dérive terminologique entre systèmes et équipes.',
        outcome: 'Un alignement sémantique fiable pour la transformation d\'entreprise.',
      },
      {
        title: 'Moteur d\'accumulation de connaissance',
        detail: 'Boucles d\'enrichissement continues qui font croître l\'intelligence d\'entreprise.',
        purpose: 'Capturer les retours et faire évoluer l\'architecture en continu.',
        value: 'Transforme une architecture statique en capacité cumulative.',
        outcome: 'Les systèmes s\'améliorent avec l\'usage au lieu de se dégrader avec la complexité.',
      },
    ],
    outputs: [
      { title: 'Assistants IA', detail: 'Assistants ancrés dans le contexte et la gouvernance de l\'entreprise.' },
      { title: 'Recherche d\'entreprise', detail: 'Retrieval sémantique qui comprend les entités et les relations.' },
      { title: 'Systèmes agentiques', detail: 'Agents orchestrés avec contexte d\'entreprise et contrôles opérationnels.' },
      { title: 'Aide à la décision', detail: 'Chemins de raisonnement reliant faits, politiques et résultats métier.' },
      { title: 'Analytique', detail: 'Analyse métier alignée sur des définitions sémantiques partagées.' },
      { title: 'Automatisation des workflows', detail: 'Automatisation guidée par l\'état des entités, les politiques et les règles d\'entreprise.' },
      { title: 'Découverte de connaissance', detail: 'Remontée d\'insights à travers le contexte connecté de l\'entreprise.' },
    ],
    capabilities: [
      { title: 'Résolution d\'entités', detail: 'Résoudre les identités dupliquées et fragmentées entre systèmes.' },
      { title: 'Retrieval fondé', detail: 'Retourner le contexte avec provenance et précision sémantique.' },
      { title: 'Conception de taxonomies', detail: 'Organiser les termes métier et les hiérarchies pour la réutilisation d\'entreprise.' },
    ],
  },
  es: {
    zones: ['Entradas', 'Capa de conocimiento', 'Aplicaciones IA'],
    header: {
      title: 'Capa de conocimiento',
      description: 'La arquitectura que convierte la información fragmentada de la empresa en inteligencia desplegable.',
    },
    detailLabels: {
      purpose: 'Propósito',
      value: 'Valor de negocio',
      outcome: 'Resultado empresarial',
    },
    itemKinds: {
      input: 'entrada',
      layer: 'capa',
      output: 'salida',
      capability: 'capacidad',
    },
    inputs: [
      { title: 'Bases de datos', detail: 'Registros estructurados, sistemas operativos y repositorios de datos empresariales.' },
      { title: 'Documentos', detail: 'Políticas, contratos, especificaciones y conocimiento operativo no estructurado.' },
      { title: 'Correos', detail: 'Memoria institucional y contexto de decisiones capturados en las comunicaciones.' },
      { title: 'APIs', detail: 'Interfaces entre sistemas que exponen entidades, eventos y estado de procesos.' },
      { title: 'CRM', detail: 'Contexto de cliente y cuenta que debe alinearse con la ontología empresarial.' },
      { title: 'ERP', detail: 'Sistemas operativos y financieros con alto contenido semántico de negocio.' },
      { title: 'Aplicaciones', detail: 'Plataformas de negocio con contexto operativo fragmentado pero crítico.' },
      { title: 'Lagos de datos', detail: 'Repositorios grandes que requieren curación semántica antes de usar IA empresarial.' },
    ],
    layers: [
      {
        title: 'Gobernanza',
        detail: 'Controles de propiedad, política y stewardship para conocimiento confiable.',
        purpose: 'Establecer responsabilidad y control sobre los activos de conocimiento.',
        value: 'Aumenta la confianza, la seguridad de cumplimiento y la adopción.',
        outcome: 'Los sistemas de IA operan dentro de límites operativos y regulatorios definidos.',
      },
      {
        title: 'Ingeniería de datos',
        detail: 'Ingesta, normalización, linaje e integración de fuentes fragmentadas.',
        purpose: 'Transformar datos fuente fragmentados en flujos fiables y utilizables.',
        value: 'Mejora la interoperabilidad y reduce fallos de integración.',
        outcome: 'Flujos de información estables que soportan operaciones de IA escalables.',
      },
      {
        title: 'Modelos semánticos',
        detail: 'Estructuras conceptuales compartidas que conectan el significado de negocio con los sistemas técnicos.',
        purpose: 'Traducir registros técnicos en conceptos de negocio consistentes.',
        value: 'Alinea equipos, sistemas y análisis alrededor de un significado compartido.',
        outcome: 'Menos ambigüedad y mejor calidad de razonamiento en aplicaciones de IA.',
      },
      {
        title: 'Grafos de conocimiento',
        detail: 'Arquitectura conectada de entidades y relaciones con procedencia y contexto.',
        purpose: 'Conectar entidades, eventos y dependencias en un tejido de grafo consultable.',
        value: 'Mejora el retrieval, la trazabilidad y la explicabilidad.',
        outcome: 'Resultados de IA con contexto y anclados en relaciones empresariales.',
      },
      {
        title: 'Ontologías',
        detail: 'Modelos formales de dominio que definen el lenguaje y la lógica conceptual.',
        purpose: 'Definir significado duradero y consistencia conceptual en toda la empresa.',
        value: 'Reduce la deriva terminológica entre sistemas y equipos.',
        outcome: 'Alineación semántica fiable para la transformación empresarial.',
      },
      {
        title: 'Motor de acumulación de conocimiento',
        detail: 'Bucles continuos de enriquecimiento que compiten inteligencia empresarial con el tiempo.',
        purpose: 'Capturar feedback y evolucionar la arquitectura de forma continua.',
        value: 'Convierte una arquitectura estática en una capacidad acumulativa.',
        outcome: 'Los sistemas mejoran con el uso en lugar de degradarse con la complejidad.',
      },
    ],
    outputs: [
      { title: 'Asistentes de IA', detail: 'Asistentes anclados en el contexto y la gobernanza empresarial.' },
      { title: 'Búsqueda empresarial', detail: 'Retrieval semántico que entiende entidades y relaciones.' },
      { title: 'Sistemas agenticos', detail: 'Agentes orquestados con contexto empresarial y controles operativos.' },
      { title: 'Soporte a decisiones', detail: 'Rutas de razonamiento que conectan hechos, políticas y resultados de negocio.' },
      { title: 'Analítica', detail: 'Análisis de negocio alineado con definiciones semánticas compartidas.' },
      { title: 'Automatización de flujos', detail: 'Automatización guiada por estado de entidades, políticas y reglas empresariales.' },
      { title: 'Descubrimiento de conocimiento', detail: 'Insights emergentes a través del contexto conectado de la empresa.' },
    ],
    capabilities: [
      { title: 'Resolución de entidades', detail: 'Resolver identidades duplicadas y fragmentadas entre sistemas.' },
      { title: 'Retrieval fundamentado', detail: 'Devolver contexto con procedencia y precisión semántica.' },
      { title: 'Diseño de taxonomías', detail: 'Organizar términos de dominio y jerarquías para reutilización empresarial.' },
    ],
  },
}

export function getAppContent(locale: Locale): AppContent {
  return appCopy[locale]
}

export function getKnowledgeGraphContent(locale: Locale): KnowledgeGraphContent {
  return knowledgeGraphCopy[locale]
}
