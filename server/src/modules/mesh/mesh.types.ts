/**
 * Cambium Research Platform — Federated Knowledge Mesh Types (Milestone 13 Draft)
 */

export interface UniversityNodeDescriptor {
  nodeId: string;
  institutionRor: string;
  institutionName: string;
  endpointUrl: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  publicKeyPem: string;
  federatedEntitiesCount: {
    scholars: number;
    opportunities: number;
    sharedInstruments: number;
  };
  supportedProtocols: Array<'GRAPHQL_FEDERATION_V2' | 'GRPC_MESH_V1'>;
}

export interface FederatedMeshQuery {
  queryId: string;
  originNodeId: string;
  targetInstitutions?: string[];
  semanticQuery: string;
  maxHops: number;
  timeoutMs: number;
}
