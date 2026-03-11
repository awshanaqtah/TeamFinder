import { Major, ProjectIdea } from './types';

export const SPECIALIZATIONS: Record<Major, string[]> = {
  [Major.AIDS]: [
    "ML Engineer",
    "Data Engineer",
    "Computer Vision Engineer",
    "NLP Engineer",
    "BI Analyst",
    "MLOps Engineer",
    "Research Scientist",
  ],
  [Major.CSCYS]: [
    "SOC Analyst",
    "Penetration Tester",
    "Cloud Security Engineer",
    "Cryptography Engineer",
    "Digital Forensics Analyst",
    "Malware Analyst",
    "DevSecOps Engineer",
  ],
  [Major.CISBIT]: [
    "IT Consultant",
    "ERP Specialist",
    "Business Analyst",
    "UX Designer",
    "Database Administrator",
    "IT Project Manager",
    "Systems Analyst",
  ],
};

const DEFAULT_PROJECT_POOL_BY_MAJOR: Record<Major, ProjectIdea[]> = {
  [Major.AIDS]: [
    {
      title: 'Student Retention Risk Predictor',
      description: 'Predict at-risk students early using attendance, assignment, and LMS activity patterns.',
      scope: 'Build a data pipeline, train baseline models, and visualize risk levels for advisors.',
      suggestedStack: 'Python, Pandas, Scikit-learn, FastAPI, React',
      difficulty: 'Intermediate'
    },
    {
      title: 'Smart Study Planner Assistant',
      description: 'Generate weekly study plans based on course load, deadlines, and student preferences.',
      scope: 'Implement schedule optimization and create a planner UI with progress tracking.',
      suggestedStack: 'Python, OR-Tools, React, PostgreSQL',
      difficulty: 'Beginner'
    },
    {
      title: 'Campus Food Demand Forecasting',
      description: 'Forecast cafeteria demand to reduce food waste and stock-outs.',
      scope: 'Train time-series models and provide a dashboard for operations planning.',
      suggestedStack: 'Python, Prophet, Plotly, Streamlit',
      difficulty: 'Intermediate'
    },
    {
      title: 'Course Recommendation Engine',
      description: 'Recommend elective courses based on student skills, goals, and historical outcomes.',
      scope: 'Create user profiles, build recommendation logic, and evaluate recommendation quality.',
      suggestedStack: 'Python, Surprise, Flask, SQLite',
      difficulty: 'Intermediate'
    },
    {
      title: 'Attendance Anomaly Detection Tool',
      description: 'Detect unusual attendance trends across sections and semesters.',
      scope: 'Build anomaly detection workflows and provide actionable alerts for coordinators.',
      suggestedStack: 'Python, PyOD, Dash',
      difficulty: 'Intermediate'
    },
    {
      title: 'Research Topic Discovery Assistant',
      description: 'Help students find project topics by clustering and summarizing recent papers.',
      scope: 'Ingest paper metadata, run topic modeling, and expose searchable insights.',
      suggestedStack: 'Python, Transformers, BERTopic, React',
      difficulty: 'Advanced'
    }
  ],
  [Major.CSCYS]: [
    {
      title: 'SOC Alert Correlation Platform',
      description: 'Correlate security events and reduce false positives for faster SOC response.',
      scope: 'Ingest multi-source logs, correlation rules, and analyst investigation views.',
      suggestedStack: 'Python, Elasticsearch, Kibana, React',
      difficulty: 'Intermediate'
    },
    {
      title: 'Vulnerability Management Dashboard',
      description: 'Aggregate vulnerability scan results and track remediation progress.',
      scope: 'Build scanner integrations, risk scoring, and remediation workflows.',
      suggestedStack: 'Node.js, PostgreSQL, React',
      difficulty: 'Intermediate'
    },
    {
      title: 'Cloud Security Posture Monitor',
      description: 'Audit cloud resources for misconfigurations and policy violations.',
      scope: 'Implement rule-based checks and compliance reporting views.',
      suggestedStack: 'Python, AWS SDK, FastAPI, React',
      difficulty: 'Advanced'
    },
    {
      title: 'Secure CI/CD Gatekeeper',
      description: 'Enforce security checks in deployment pipelines before release.',
      scope: 'Add SAST/DAST/secret scanning with policy-based pipeline gates.',
      suggestedStack: 'GitHub Actions, Python, Docker',
      difficulty: 'Intermediate'
    },
    {
      title: 'Digital Forensics Evidence Tracker',
      description: 'Track evidence chain-of-custody and analysis artifacts across cases.',
      scope: 'Build case timelines, evidence records, and investigator collaboration tools.',
      suggestedStack: 'React, Express, PostgreSQL',
      difficulty: 'Advanced'
    },
    {
      title: 'Malware Behavior Sandbox',
      description: 'Execute suspicious samples in isolated environments and record behavior.',
      scope: 'Automate sample execution, behavior extraction, and risk reporting.',
      suggestedStack: 'Python, Docker, ELK Stack',
      difficulty: 'Intermediate'
    }
  ],
  [Major.CISBIT]: [
    {
      title: 'Department KPI Intelligence Dashboard',
      description: 'Track academic and operational KPIs for departments with drill-down insights.',
      scope: 'Build KPI definitions, ETL flows, and interactive charts for decision-makers.',
      suggestedStack: 'Power BI, SQL, Python',
      difficulty: 'Intermediate'
    },
    {
      title: 'IT Ticket Workflow Optimizer',
      description: 'Automate ticket triage and SLA tracking for IT support teams.',
      scope: 'Design workflow states, assignment rules, and SLA breach notifications.',
      suggestedStack: 'React, Node.js, PostgreSQL',
      difficulty: 'Intermediate'
    },
    {
      title: 'Procurement Approval Tracker',
      description: 'Digitize purchase request approvals with audit trails and status transparency.',
      scope: 'Implement multi-step approvals, role permissions, and reporting.',
      suggestedStack: 'ASP.NET, SQL Server, Bootstrap',
      difficulty: 'Beginner'
    },
    {
      title: 'CRM Analytics Workbench',
      description: 'Analyze customer interactions and conversion funnels for business teams.',
      scope: 'Create segment analysis, funnel reports, and campaign performance views.',
      suggestedStack: 'Python, SQL, Tableau',
      difficulty: 'Intermediate'
    },
    {
      title: 'Compliance Evidence Collector',
      description: 'Centralize policy evidence and control documentation for compliance reviews.',
      scope: 'Design control libraries, evidence uploads, and review workflows.',
      suggestedStack: 'React, Firebase, Cloud Functions',
      difficulty: 'Intermediate'
    },
    {
      title: 'Budget Forecast Reporting Tool',
      description: 'Forecast budget utilization and variance across departments.',
      scope: 'Develop forecast models, scenario planning, and automated monthly reports.',
      suggestedStack: 'Excel Power Query, Python, Power BI',
      difficulty: 'Beginner'
    }
  ]
};

const SPECIALIZATION_PROJECT_OVERRIDES: Partial<Record<Major, Record<string, ProjectIdea[]>>> = {
  [Major.AIDS]: {
    'ML Engineer': [
      {
        title: 'Model Registry and Monitoring Platform',
        description: 'Track model versions and monitor inference quality in production-like settings.',
        scope: 'Build training-to-serving workflow with drift and performance alerts.',
        suggestedStack: 'MLflow, FastAPI, React, PostgreSQL',
        difficulty: 'Advanced'
      },
      {
        title: 'Feature Store for Student Analytics',
        description: 'Create reusable feature pipelines for multiple prediction tasks.',
        scope: 'Design feature definitions, backfill jobs, and online serving layer.',
        suggestedStack: 'Python, Feast, Redis, Airflow',
        difficulty: 'Advanced'
      },
      {
        title: 'AutoML Benchmarking Toolkit',
        description: 'Compare AutoML strategies across real campus datasets.',
        scope: 'Automate experiments, track metrics, and summarize winning approaches.',
        suggestedStack: 'Python, Optuna, Scikit-learn, Streamlit',
        difficulty: 'Intermediate'
      },
      {
        title: 'MLOps Release Readiness Checker',
        description: 'Validate data, model, and API quality before deployment.',
        scope: 'Implement test gates and release checks integrated with CI.',
        suggestedStack: 'PyTest, Great Expectations, GitHub Actions',
        difficulty: 'Intermediate'
      }
    ],
    'NLP Engineer': [
      {
        title: 'Arabic-English Course Q&A Bot',
        description: 'Answer course-related questions using uploaded syllabus and policy documents.',
        scope: 'Build retrieval, prompt orchestration, and answer citation support.',
        suggestedStack: 'Python, LangChain, FAISS, React',
        difficulty: 'Advanced'
      },
      {
        title: 'Feedback Sentiment Intelligence',
        description: 'Analyze open-text course feedback and cluster common themes.',
        scope: 'Implement sentiment, topic extraction, and instructor dashboards.',
        suggestedStack: 'Python, Transformers, Plotly Dash',
        difficulty: 'Intermediate'
      },
      {
        title: 'Meeting Notes Summarizer',
        description: 'Summarize long project meetings into action items and owners.',
        scope: 'Support transcript input, summary generation, and export.',
        suggestedStack: 'Python, Whisper, LLM API, React',
        difficulty: 'Intermediate'
      },
      {
        title: 'Academic Writing Style Assistant',
        description: 'Give style and clarity suggestions without changing academic meaning.',
        scope: 'Build text analysis and recommendation workflows with revision history.',
        suggestedStack: 'Python, spaCy, FastAPI',
        difficulty: 'Intermediate'
      }
    ],
    'Data Engineer': [
      {
        title: 'Real-Time Campus Data Pipeline',
        description: 'Stream and process campus activity data for operational analytics.',
        scope: 'Build ingestion, transformation, and storage layers with monitoring and retries.',
        suggestedStack: 'Python, Kafka, Spark, PostgreSQL',
        difficulty: 'Advanced'
      },
      {
        title: 'Student Data Warehouse Builder',
        description: 'Unify data from LMS, SIS, and assessment systems into an analytics-ready warehouse.',
        scope: 'Design dimensional models and scheduled ETL jobs for reporting.',
        suggestedStack: 'SQL, dbt, Airflow, BigQuery',
        difficulty: 'Intermediate'
      },
      {
        title: 'Data Quality Rule Engine',
        description: 'Detect missing, inconsistent, or anomalous records before downstream ML tasks.',
        scope: 'Implement validation rules, alerting, and remediation workflows.',
        suggestedStack: 'Great Expectations, Python, FastAPI',
        difficulty: 'Intermediate'
      },
      {
        title: 'ETL Operations Command Center',
        description: 'Track ETL run status, latency, failures, and SLA adherence.',
        scope: 'Create an observability dashboard and incident response workflow.',
        suggestedStack: 'React, Node.js, Prometheus, Grafana',
        difficulty: 'Beginner'
      }
    ],
    'Computer Vision Engineer': [
      {
        title: 'Smart Attendance Vision System',
        description: 'Automate attendance using face recognition with privacy-aware controls.',
        scope: 'Implement detection, recognition, and confidence threshold management.',
        suggestedStack: 'Python, OpenCV, FaceNet, FastAPI',
        difficulty: 'Advanced'
      },
      {
        title: 'Lab Safety PPE Detection',
        description: 'Detect safety equipment usage in lab footage to improve compliance.',
        scope: 'Train object detection models and expose alert dashboards.',
        suggestedStack: 'Python, YOLO, Streamlit',
        difficulty: 'Intermediate'
      },
      {
        title: 'Library Seat Occupancy Analyzer',
        description: 'Estimate seat availability from camera feeds in real time.',
        scope: 'Build occupancy detection and hourly usage trend analytics.',
        suggestedStack: 'Python, OpenCV, Flask, React',
        difficulty: 'Intermediate'
      },
      {
        title: 'Document OCR Classification Tool',
        description: 'Extract and classify forms and documents for administrative workflows.',
        scope: 'Implement OCR pipeline and document type prediction API.',
        suggestedStack: 'Tesseract, Python, Scikit-learn, FastAPI',
        difficulty: 'Beginner'
      }
    ],
    'BI Analyst': [
      {
        title: 'University KPI Storyboard',
        description: 'Deliver leadership-friendly KPI stories from multiple institutional datasets.',
        scope: 'Create a curated semantic model and interactive executive views.',
        suggestedStack: 'Power BI, SQL Server, Python',
        difficulty: 'Beginner'
      },
      {
        title: 'Student Success Intelligence Dashboard',
        description: 'Visualize retention, progression, and engagement across departments.',
        scope: 'Build cohort comparisons and early-risk slicing capabilities.',
        suggestedStack: 'Tableau, PostgreSQL, dbt',
        difficulty: 'Intermediate'
      },
      {
        title: 'Budget Variance Analytics Studio',
        description: 'Monitor actual-vs-planned spend and identify major variance drivers.',
        scope: 'Develop variance decomposition and drill-through analysis.',
        suggestedStack: 'Power BI, Excel, SQL',
        difficulty: 'Beginner'
      },
      {
        title: 'Admissions Funnel Intelligence',
        description: 'Track application funnel stages and conversion bottlenecks.',
        scope: 'Build funnel models, segmentation filters, and trend alerts.',
        suggestedStack: 'Looker Studio, BigQuery, Python',
        difficulty: 'Intermediate'
      }
    ],
    'MLOps Engineer': [
      {
        title: 'Model Deployment Canary Platform',
        description: 'Safely roll out model versions with canary traffic and rollback controls.',
        scope: 'Implement release orchestration and online metric monitoring.',
        suggestedStack: 'Kubernetes, FastAPI, Prometheus, Grafana',
        difficulty: 'Advanced'
      },
      {
        title: 'ML Drift Monitoring Service',
        description: 'Track data and concept drift for deployed models and alert owners.',
        scope: 'Build drift detectors and operational dashboard views.',
        suggestedStack: 'Evidently, Python, PostgreSQL, React',
        difficulty: 'Intermediate'
      },
      {
        title: 'Automated Retraining Orchestrator',
        description: 'Trigger retraining pipelines based on performance and drift thresholds.',
        scope: 'Create pipeline scheduling, artifact tracking, and approval gates.',
        suggestedStack: 'Airflow, MLflow, Python, Docker',
        difficulty: 'Advanced'
      },
      {
        title: 'ML Experiment Governance Portal',
        description: 'Centralize experiment metadata, approvals, and reproducibility checks.',
        scope: 'Implement experiment tracking and audit-friendly review workflow.',
        suggestedStack: 'React, Node.js, PostgreSQL, MLflow API',
        difficulty: 'Intermediate'
      }
    ],
    'Research Scientist': [
      {
        title: 'AI Benchmark Evaluation Suite',
        description: 'Benchmark model families on shared datasets with standardized metrics.',
        scope: 'Build evaluation harness and reproducible experiment templates.',
        suggestedStack: 'Python, PyTorch, Weights and Biases',
        difficulty: 'Advanced'
      },
      {
        title: 'Reproducible Experiment Tracker',
        description: 'Ensure experiments can be re-run with identical data and configurations.',
        scope: 'Track configs, seeds, artifacts, and environment metadata.',
        suggestedStack: 'Python, DVC, MLflow, Git',
        difficulty: 'Intermediate'
      },
      {
        title: 'Paper-to-Prototype Explorer',
        description: 'Convert selected research papers into executable prototype baselines.',
        scope: 'Implement paper parsing workflows and baseline implementation templates.',
        suggestedStack: 'Python, Jupyter, Transformers',
        difficulty: 'Advanced'
      },
      {
        title: 'Human-in-the-Loop Evaluation Lab',
        description: 'Collect structured human feedback for model behavior analysis.',
        scope: 'Build evaluation interfaces, rating schema, and analysis reports.',
        suggestedStack: 'React, FastAPI, PostgreSQL',
        difficulty: 'Intermediate'
      }
    ]
  },
  [Major.CSCYS]: {
    'SOC Analyst': [
      {
        title: 'SIEM Alert Triage Dashboard',
        description: 'Prioritize, assign, and resolve SOC alerts with analyst workflows.',
        scope: 'Ingest alerts, add severity scoring, and show response metrics.',
        suggestedStack: 'React, Node.js, Elasticsearch, Kibana',
        difficulty: 'Intermediate'
      },
      {
        title: 'Threat Hunting Workbench',
        description: 'Correlate logs and IOCs for proactive threat hunting cases.',
        scope: 'Build IOC search, timeline reconstruction, and findings export.',
        suggestedStack: 'Python, FastAPI, PostgreSQL, React',
        difficulty: 'Intermediate'
      },
      {
        title: 'Incident Response Tracker',
        description: 'Track incident lifecycle, owners, and response SLAs in one board.',
        scope: 'Implement incident states, escalation rules, and postmortem reports.',
        suggestedStack: 'TypeScript, Express, React, Supabase',
        difficulty: 'Intermediate'
      },
      {
        title: 'SOC Playbook Automation Tool',
        description: 'Automate repetitive response steps from common SOC playbooks.',
        scope: 'Create trigger-action workflows and approval checkpoints.',
        suggestedStack: 'Python, Celery, Redis, React',
        difficulty: 'Beginner'
      }
    ],
    'Penetration Tester': [
      {
        title: 'Web Vulnerability Assessment Toolkit',
        description: 'Scan web apps for common OWASP weaknesses and generate reports.',
        scope: 'Automate checks and produce severity-ranked findings.',
        suggestedStack: 'Python, OWASP ZAP API, React',
        difficulty: 'Advanced'
      },
      {
        title: 'Phishing Awareness Simulator',
        description: 'Simulate phishing campaigns and track user awareness metrics.',
        scope: 'Design templates, campaign scheduling, and analytics.',
        suggestedStack: 'Node.js, PostgreSQL, React',
        difficulty: 'Intermediate'
      },
      {
        title: 'Privilege Escalation Lab Builder',
        description: 'Provision safe local labs to practice privilege escalation techniques.',
        scope: 'Automate environment setup with guided challenge scenarios.',
        suggestedStack: 'Docker, Bash, Python',
        difficulty: 'Advanced'
      },
      {
        title: 'Security Baseline Auditor',
        description: 'Audit endpoint configurations against hardening benchmarks.',
        scope: 'Collect system settings and report non-compliant controls.',
        suggestedStack: 'Python, PowerShell, SQLite',
        difficulty: 'Intermediate'
      }
    ],
    'Cloud Security Engineer': [
      {
        title: 'Cloud Misconfiguration Scanner',
        description: 'Scan cloud accounts for risky IAM, storage, and network settings.',
        scope: 'Implement policy checks and prioritized remediation guidance.',
        suggestedStack: 'Python, AWS SDK, Terraform, React',
        difficulty: 'Advanced'
      },
      {
        title: 'IAM Least-Privilege Analyzer',
        description: 'Analyze access logs and recommend least-privilege IAM policies.',
        scope: 'Build permissions graph and policy recommendation engine.',
        suggestedStack: 'Python, Neo4j, FastAPI',
        difficulty: 'Advanced'
      },
      {
        title: 'Container Security Compliance Monitor',
        description: 'Validate container workloads against baseline security controls.',
        scope: 'Automate checks for image, runtime, and network hardening controls.',
        suggestedStack: 'Kubernetes, Trivy, Prometheus, Grafana',
        difficulty: 'Intermediate'
      },
      {
        title: 'Multi-Cloud Secret Exposure Detector',
        description: 'Detect exposed credentials in repos, pipelines, and cloud logs.',
        scope: 'Create detection rules and automated incident tickets.',
        suggestedStack: 'Python, GitHub API, CloudWatch, ELK',
        difficulty: 'Intermediate'
      }
    ],
    'Cryptography Engineer': [
      {
        title: 'Secure Messaging with Forward Secrecy',
        description: 'Build end-to-end encrypted chat with modern key exchange.',
        scope: 'Implement session keys, key rotation, and secure transport handling.',
        suggestedStack: 'TypeScript, Web Crypto API, Node.js',
        difficulty: 'Advanced'
      },
      {
        title: 'PKI Certificate Lifecycle Manager',
        description: 'Issue, rotate, revoke, and monitor certificates across services.',
        scope: 'Build certificate workflows and expiry alerting dashboards.',
        suggestedStack: 'Go, OpenSSL, PostgreSQL, React',
        difficulty: 'Intermediate'
      },
      {
        title: 'File Encryption Key Rotation Service',
        description: 'Encrypt shared files and rotate encryption keys with minimal downtime.',
        scope: 'Implement envelope encryption and re-encryption jobs.',
        suggestedStack: 'Python, AES-GCM, KMS API, FastAPI',
        difficulty: 'Intermediate'
      },
      {
        title: 'Zero-Knowledge Login Prototype',
        description: 'Prototype password-auth flow that never transmits secret equivalents.',
        scope: 'Build protocol implementation and threat model documentation.',
        suggestedStack: 'Rust, WebAssembly, React',
        difficulty: 'Advanced'
      }
    ],
    'Digital Forensics Analyst': [
      {
        title: 'Disk Artifact Timeline Analyzer',
        description: 'Extract and visualize filesystem artifacts for incident investigations.',
        scope: 'Build parsers for key artifacts and timeline reconstruction.',
        suggestedStack: 'Python, Autopsy APIs, SQLite',
        difficulty: 'Advanced'
      },
      {
        title: 'Memory Forensics Triage Toolkit',
        description: 'Automate triage of volatile memory captures for suspicious indicators.',
        scope: 'Integrate volatility plugins and generate structured reports.',
        suggestedStack: 'Python, Volatility, React',
        difficulty: 'Advanced'
      },
      {
        title: 'Email Forensics Investigation Console',
        description: 'Trace phishing campaigns using headers, links, and attachment metadata.',
        scope: 'Build parser workflows and IOC pivot capabilities.',
        suggestedStack: 'Python, FastAPI, Elasticsearch',
        difficulty: 'Intermediate'
      },
      {
        title: 'Chain-of-Custody Evidence Vault',
        description: 'Track evidence custody records with tamper-evident integrity checks.',
        scope: 'Implement immutable logs and evidence handover workflows.',
        suggestedStack: 'Node.js, PostgreSQL, React',
        difficulty: 'Intermediate'
      }
    ],
    'Malware Analyst': [
      {
        title: 'Static Malware Feature Extractor',
        description: 'Extract static features from binaries for rapid malware triage.',
        scope: 'Build parsing pipeline and feature dashboards.',
        suggestedStack: 'Python, PEfile, YARA, FastAPI',
        difficulty: 'Intermediate'
      },
      {
        title: 'Malware Behavior Classification Sandbox',
        description: 'Run suspicious files in sandboxed environments and classify behavior patterns.',
        scope: 'Automate execution traces and model-based behavior tagging.',
        suggestedStack: 'Docker, Python, ELK Stack',
        difficulty: 'Advanced'
      },
      {
        title: 'IOC Extraction Feed Generator',
        description: 'Extract indicators of compromise and publish validated threat feeds.',
        scope: 'Implement IOC normalization and confidence scoring.',
        suggestedStack: 'Python, STIX/TAXII, PostgreSQL',
        difficulty: 'Intermediate'
      },
      {
        title: 'YARA Rule Authoring Assistant',
        description: 'Assist analysts with rule generation and false-positive analysis.',
        scope: 'Build rule templates, testing harness, and feedback loop.',
        suggestedStack: 'Python, YARA, React',
        difficulty: 'Beginner'
      }
    ],
    'DevSecOps Engineer': [
      {
        title: 'Policy-as-Code Pipeline Enforcer',
        description: 'Enforce security policies in CI/CD with automated approval gates.',
        scope: 'Implement policy checks for IaC, dependencies, and secrets.',
        suggestedStack: 'OPA, GitHub Actions, Python',
        difficulty: 'Advanced'
      },
      {
        title: 'Dependency Vulnerability Gate',
        description: 'Block vulnerable dependencies from release pipelines based on risk policies.',
        scope: 'Integrate scanner outputs and exception management workflow.',
        suggestedStack: 'Node.js, Snyk API, React, PostgreSQL',
        difficulty: 'Intermediate'
      },
      {
        title: 'Container Image Hardening Pipeline',
        description: 'Automate image hardening and compliance checks before deployment.',
        scope: 'Build image baseline checks and scorecard reporting.',
        suggestedStack: 'Docker, Trivy, Kubernetes, Grafana',
        difficulty: 'Intermediate'
      },
      {
        title: 'Secrets Detection and Rotation Bot',
        description: 'Detect leaked secrets and trigger automated credential rotation.',
        scope: 'Implement scanning hooks, rotation playbooks, and audit logs.',
        suggestedStack: 'Python, Vault, GitHub API, FastAPI',
        difficulty: 'Advanced'
      }
    ]
  },
  [Major.CISBIT]: {
    'IT Project Manager': [
      {
        title: 'Sprint Capacity Planner',
        description: 'Forecast sprint capacity and detect delivery risks early.',
        scope: 'Build team workload models and sprint planning recommendations.',
        suggestedStack: 'React, Node.js, PostgreSQL',
        difficulty: 'Intermediate'
      },
      {
        title: 'Project Risk Radar',
        description: 'Track and visualize project risks with probability-impact scoring.',
        scope: 'Implement risk lifecycle, ownership, and mitigation tracking.',
        suggestedStack: 'Power BI, SQL, Python',
        difficulty: 'Beginner'
      },
      {
        title: 'Stakeholder Status Automation',
        description: 'Generate stakeholder updates from project data automatically.',
        scope: 'Create templated summaries and scheduled email digests.',
        suggestedStack: 'Python, Airtable API, Power Automate',
        difficulty: 'Beginner'
      },
      {
        title: 'Milestone Governance Dashboard',
        description: 'Monitor milestone health, dependencies, and blockers across initiatives.',
        scope: 'Build governance views and escalation alerts.',
        suggestedStack: 'React, Supabase, Chart.js',
        difficulty: 'Intermediate'
      }
    ],
    'Business Analyst': [
      {
        title: 'Executive Performance Cockpit',
        description: 'Consolidate KPI reporting for leadership decision-making.',
        scope: 'Create data model, KPI tiles, and trend exploration.',
        suggestedStack: 'Power BI, SQL Server',
        difficulty: 'Beginner'
      },
      {
        title: 'Enrollment Funnel Analytics',
        description: 'Analyze enrollment stages and identify conversion bottlenecks.',
        scope: 'Develop funnel views and cohort comparison reports.',
        suggestedStack: 'Tableau, Python, PostgreSQL',
        difficulty: 'Intermediate'
      },
      {
        title: 'Procurement Spend Insights',
        description: 'Classify and analyze procurement spend by category and vendor.',
        scope: 'Build anomaly checks and cost-saving opportunity reports.',
        suggestedStack: 'Python, SQL, Power BI',
        difficulty: 'Intermediate'
      },
      {
        title: 'Service Desk Analytics Hub',
        description: 'Track ticket trends, root causes, and SLA performance.',
        scope: 'Design operational dashboards and monthly insight exports.',
        suggestedStack: 'Looker Studio, BigQuery',
        difficulty: 'Beginner'
      }
    ],
    'IT Consultant': [
      {
        title: 'IT Maturity Assessment Portal',
        description: 'Assess organizational IT capabilities across process and technology dimensions.',
        scope: 'Build maturity questionnaires, scoring models, and gap analysis reports.',
        suggestedStack: 'React, Node.js, PostgreSQL',
        difficulty: 'Beginner'
      },
      {
        title: 'Service Catalog Optimization Tool',
        description: 'Analyze service catalog usage and recommend consolidation opportunities.',
        scope: 'Implement service metrics, overlap detection, and recommendations.',
        suggestedStack: 'Python, SQL, Power BI',
        difficulty: 'Intermediate'
      },
      {
        title: 'Digital Transformation Roadmap Planner',
        description: 'Plan phased transformation initiatives with value, cost, and risk views.',
        scope: 'Create prioritization scoring and roadmap timeline features.',
        suggestedStack: 'TypeScript, React, Supabase',
        difficulty: 'Intermediate'
      },
      {
        title: 'Vendor Evaluation Scoring System',
        description: 'Standardize vendor evaluation with weighted criteria and audit trails.',
        scope: 'Build evaluation workflows, comparison matrices, and approval records.',
        suggestedStack: 'ASP.NET, SQL Server, Bootstrap',
        difficulty: 'Beginner'
      }
    ],
    'ERP Specialist': [
      {
        title: 'ERP Module Adoption Tracker',
        description: 'Measure ERP module usage, adoption barriers, and training impact.',
        scope: 'Build role-level usage analytics and action plans.',
        suggestedStack: 'Power BI, SQL, Python',
        difficulty: 'Beginner'
      },
      {
        title: 'Procure-to-Pay Workflow Optimizer',
        description: 'Optimize procure-to-pay process timing and exception rates.',
        scope: 'Map workflow bottlenecks and recommend process automation.',
        suggestedStack: 'SAP APIs, Python, Tableau',
        difficulty: 'Intermediate'
      },
      {
        title: 'Master Data Consistency Auditor',
        description: 'Detect and resolve inconsistent master data across ERP domains.',
        scope: 'Implement validation checks and remediation tracking.',
        suggestedStack: 'SQL, dbt, React',
        difficulty: 'Intermediate'
      },
      {
        title: 'ERP Integration Health Dashboard',
        description: 'Monitor ERP integration reliability and latency across connected systems.',
        scope: 'Build integration observability and incident reporting views.',
        suggestedStack: 'Node.js, PostgreSQL, Grafana',
        difficulty: 'Intermediate'
      }
    ],
    'UX Designer': [
      {
        title: 'Student Portal UX Research Hub',
        description: 'Centralize research findings, personas, and usability evidence.',
        scope: 'Create repository workflows and insight tagging for product teams.',
        suggestedStack: 'Figma, Notion API, React',
        difficulty: 'Beginner'
      },
      {
        title: 'Accessibility Design System',
        description: 'Build reusable UI patterns that meet accessibility standards.',
        scope: 'Design component library and accessibility audit checks.',
        suggestedStack: 'Figma, Storybook, React',
        difficulty: 'Intermediate'
      },
      {
        title: 'Usability Session Analyzer',
        description: 'Analyze moderated usability sessions and summarize friction patterns.',
        scope: 'Support session notes, tagging, and insight visualization.',
        suggestedStack: 'Python, React, PostgreSQL',
        difficulty: 'Intermediate'
      },
      {
        title: 'Information Architecture Prototype Studio',
        description: 'Prototype and test navigation structures for enterprise systems.',
        scope: 'Build card-sorting inputs, tree-testing, and comparative reporting.',
        suggestedStack: 'TypeScript, Next.js, Supabase',
        difficulty: 'Intermediate'
      }
    ],
    'Database Administrator': [
      {
        title: 'Query Performance Tuning Console',
        description: 'Identify slow queries and recommend indexing or query rewrites.',
        scope: 'Implement query profiling and tuning recommendation workflows.',
        suggestedStack: 'PostgreSQL, Python, React',
        difficulty: 'Intermediate'
      },
      {
        title: 'Backup and Recovery Drill Manager',
        description: 'Schedule and validate backup/restore drills for critical databases.',
        scope: 'Track drill outcomes, RTO/RPO metrics, and audit readiness.',
        suggestedStack: 'PowerShell, SQL Server, Node.js',
        difficulty: 'Intermediate'
      },
      {
        title: 'Database Capacity Forecast Dashboard',
        description: 'Forecast storage, query volume, and compute growth for planning.',
        scope: 'Build forecasting models and threshold alerting.',
        suggestedStack: 'Python, InfluxDB, Grafana',
        difficulty: 'Beginner'
      },
      {
        title: 'Role-Based Access Audit Tool',
        description: 'Audit database permissions and detect excessive privilege assignments.',
        scope: 'Build role diff views and compliance status reporting.',
        suggestedStack: 'SQL, Python, React',
        difficulty: 'Intermediate'
      }
    ],
    'Systems Analyst': [
      {
        title: 'Requirements Traceability Matrix Tool',
        description: 'Trace requirements from business goals through implementation and testing.',
        scope: 'Create requirement linking, change history, and coverage views.',
        suggestedStack: 'React, Node.js, PostgreSQL',
        difficulty: 'Intermediate'
      },
      {
        title: 'Business Process Mapping Workspace',
        description: 'Model as-is/to-be processes and identify optimization opportunities.',
        scope: 'Build process maps, bottleneck scoring, and impact analysis.',
        suggestedStack: 'TypeScript, D3.js, FastAPI',
        difficulty: 'Intermediate'
      },
      {
        title: 'Change Impact Analysis Dashboard',
        description: 'Estimate downstream impact of requirement changes across modules.',
        scope: 'Implement dependency mapping and risk visualization.',
        suggestedStack: 'Neo4j, Python, React',
        difficulty: 'Advanced'
      },
      {
        title: 'Systems Integration Dependency Mapper',
        description: 'Map integration points and monitor dependency health between systems.',
        scope: 'Build integration inventory and failure trend analytics.',
        suggestedStack: 'Node.js, PostgreSQL, Grafana',
        difficulty: 'Intermediate'
      }
    ]
  }
};

export const getPresetProjectsForSpecialization = (
  major: Major | '',
  specialization: string
): ProjectIdea[] => {
  if (!major || !specialization) {
    return [];
  }

  const overrides = SPECIALIZATION_PROJECT_OVERRIDES[major]?.[specialization];
  const pool = overrides && overrides.length > 0 ? overrides : DEFAULT_PROJECT_POOL_BY_MAJOR[major];

  return pool.map(project => ({ ...project }));
};

// ============ Difficulty Assessment Constants ============
// Import and re-export from difficultyAssessmentService
export { ASSESSMENT_QUESTIONS } from './services/difficultyAssessmentService';

// ============ Team Composition Constants ============
// Import and re-export from teamCompositionService
export { TEAM_COMPOSITION_TEMPLATES } from './services/teamCompositionService';

// ============ Timeline Constants ============
// Import and re-export from timelineService
export { TIMELINE_BASE_WEEKS, TIMELINE_MILESTONES_TEMPLATE } from './services/timelineService';
