// apps/api/src/graphql/schema.ts
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    # Propostas
    proposals(
      orgUnitId: ID
      status: ProposalStatus
      labels: [String!]
      author: ID
      limit: Int = 50
      offset: Int = 0
    ): ProposalConnection!
    
    proposal(id: ID!): Proposal
    
    # Votações
    voteSessions(
      orgUnitId: ID
      active: Boolean
      limit: Int = 50
    ): [VoteSession!]!
    
    voteSession(id: ID!): VoteSession
    
    # Usuário
    me: User
    user(id: ID!): User
    
    # Delegações
    myDelegations: [Delegation!]!
    delegationsTo(userId: ID!): [Delegation!]!
    
    # Wiki
    wikiPage(orgUnitId: ID!, slug: String!): WikiPage
  }

  type Mutation {
    # Propostas
    createProposal(input: CreateProposalInput!): Proposal!
    updateProposal(id: ID!, input: UpdateProposalInput!): Proposal!
    createProposalVersion(proposalId: ID!, contentMd: String!): ProposalVersion!
    
    # Fork/Branch
    forkProposal(proposalId: ID!, name: String!): Proposal!
    createBranch(proposalId: ID!, name: String!): ProposalBranch!
    
    # Pull Requests
    createPullRequest(input: CreatePRInput!): PullRequest!
    reviewPullRequest(prId: ID!, value: ReviewValue!, reason: String): ReviewVote!
    mergePullRequest(prId: ID!): PullRequest!
    
    # Issues e Comentários
    createIssue(input: CreateIssueInput!): Issue!
    createComment(input: CreateCommentInput!): Comment!
    
    # Votação
    createVoteSession(input: CreateVoteSessionInput!): VoteSession!
    castVote(sessionId: ID!, choice: VoteChoice!, justification: String): Vote!
    
    # Delegação
    createDelegation(input: CreateDelegationInput!): Delegation!
    revokeDelegation(id: ID!): Boolean!
    
    # Labels
    addLabel(proposalId: ID!, labelName: String!): Proposal!
    removeLabel(proposalId: ID!, labelName: String!): Proposal!
    
    # Watch
    watch(targetType: String!, targetId: ID!): Watch!
    unwatch(targetType: String!, targetId: ID!): Boolean!
  }

  type Subscription {
    proposalUpdated(proposalId: ID!): Proposal!
    voteSessionStarted(orgUnitId: ID!): VoteSession!
    newComment(targetType: String!, targetId: ID!): Comment!
    notificationReceived(userId: ID!): Notification!
  }

  # Types
  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
    memberships: [Membership!]!
    reputation: UserReputation
    badges: [UserBadge!]!
    proposals(limit: Int): [Proposal!]!
    votes: [Vote!]!
  }

  type OrgUnit {
    id: ID!
    name: String!
    slug: String!
    level: OrgLevel!
    code: String
    parent: OrgUnit
    children: [OrgUnit!]!
    proposals(limit: Int): [Proposal!]!
    members: [Membership!]!
  }

  type Membership {
    id: ID!
    user: User!
    orgUnit: OrgUnit!
    role: Role!
    active: Boolean!
    createdAt: String!
  }

  type Proposal {
    id: ID!
    title: String!
    slug: String!
    status: ProposalStatus!
    orgUnit: OrgUnit!
    author: User!
    currentVersion: ProposalVersion
    versions: [ProposalVersion!]!
    branches: [ProposalBranch!]!
    labels: [Label!]!
    milestone: Milestone
    issues: [Issue!]!
    incomingPRs: [PullRequest!]!
    outgoingPRs: [PullRequest!]!
    watchers: [User!]!
    watchersCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type ProposalVersion {
    id: ID!
    version: Int!
    contentMd: String!
    createdBy: User!
    createdAt: String!
    diff: String # diff com versão anterior
  }

  type ProposalBranch {
    id: ID!
    name: String!
    proposal: Proposal!
    headVersion: ProposalVersion!
    createdBy: User!
    createdAt: String!
  }

  type Label {
    id: ID!
    name: String!
    color: String!
    orgUnit: OrgUnit!
  }

  type Milestone {
    id: ID!
    title: String!
    description: String
    dueDate: String
    closed: Boolean!
    orgUnit: OrgUnit!
    proposals: [Proposal!]!
    progress: Float! # % de propostas fechadas
  }

  type Issue {
    id: ID!
    title: String!
    body: String!
    status: IssueStatus!
    proposal: Proposal!
    author: User!
    comments: [Comment!]!
    createdAt: String!
  }

  type PullRequest {
    id: ID!
    title: String!
    description: String!
    status: PRStatus!
    fromProposal: Proposal!
    toProposal: Proposal!
    createdBy: User!
    reviews: [ReviewVote!]!
    comments: [Comment!]!
    reviewsSummary: ReviewsSummary!
    createdAt: String!
  }

  type ReviewsSummary {
    likes: Int!
    dislikes: Int!
    neutral: Int!
    consensus: Float! # -1 a 1
  }

  type ReviewVote {
    id: ID!
    value: ReviewValue!
    reason: String
    user: User!
    createdAt: String!
  }

  type Comment {
    id: ID!
    body: String!
    author: User!
    parent: Comment
    children: [Comment!]!
    createdAt: String!
  }

  type VoteSession {
    id: ID!
    title: String!
    scope: String!
    rule: VoteRule!
    round: VoteRound!
    startsAt: String!
    endsAt: String!
    orgUnit: OrgUnit!
    createdBy: User!
    votes: [Vote!]!
    results: VoteResults
    status: VoteSessionStatus!
  }

  type Vote {
    id: ID!
    choice: VoteChoice!
    weight: Int!
    justification: String
    user: User!
    createdAt: String!
  }

  type VoteResults {
    yes: Int!
    no: Int!
    abstain: Int!
    totalWeight: Int!
    participation: Float! # %
    approved: Boolean
  }

  type Delegation {
    id: ID!
    fromUser: User!
    toUser: User!
    orgUnit: OrgUnit!
    scope: String
    active: Boolean!
    createdAt: String!
    expiresAt: String
  }

  type WikiPage {
    id: ID!
    slug: String!
    title: String!
    currentVersion: WikiVersion
    versions: [WikiVersion!]!
    protected: Boolean!
    orgUnit: OrgUnit!
  }

  type WikiVersion {
    id: ID!
    version: Int!
    contentMd: String!
    summary: String
    author: User!
    createdAt: String!
  }

  type UserReputation {
    points: Int!
    proposalsCreated: Int!
    votesParticipated: Int!
    commentsPosted: Int!
    level: Int! # calculado: points / 100
  }

  type UserBadge {
    badge: Badge!
    earnedAt: String!
  }

  type Badge {
    id: ID!
    type: BadgeType!
    name: String!
    description: String!
    icon: String!
  }

  type Watch {
    id: ID!
    targetType: String!
    targetId: ID!
    createdAt: String!
  }

  type Notification {
    id: ID!
    type: NotificationType!
    title: String!
    body: String!
    targetType: String
    targetId: ID
    read: Boolean!
    createdAt: String!
  }

  type ProposalConnection {
    edges: [ProposalEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ProposalEdge {
    node: Proposal!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  # Inputs
  input CreateProposalInput {
    title: String!
    slug: String!
    orgUnitId: ID!
    contentMd: String!
    labels: [String!]
    milestoneId: ID
  }

  input UpdateProposalInput {
    title: String
    status: ProposalStatus
    milestoneId: ID
  }

  input CreatePRInput {
    fromProposalId: ID!
    toProposalId: ID!
    title: String!
    description: String!
  }

  input CreateIssueInput {
    proposalId: ID!
    title: String!
    body: String!
  }

  input CreateCommentInput {
    body: String!
    issueId: ID
    prId: ID
    parentId: ID
  }

  input CreateVoteSessionInput {
    orgUnitId: ID!
    title: String!
    scope: String!
    subjectId: ID!
    rule: VoteRule!
    round: VoteRound
    startsAt: String!
    endsAt: String!
    quorum: Int
    threshold: Int
  }

  input CreateDelegationInput {
    toUserId: ID!
    orgUnitId: ID!
    scope: String
    expiresAt: String
  }

  # Enums
  enum OrgLevel {
    NATIONAL
    STATE
    MUNICIPAL
    THEMATIC
  }

  enum Role {
    FILIADO
    COORDENADOR
    DIRETOR
    EXECUTIVO_NACIONAL
  }

  enum ProposalStatus {
    DRAFT
    OPEN
    MERGED
    REJECTED
    ARCHIVED
  }

  enum IssueStatus {
    OPEN
    CLOSED
  }

  enum PRStatus {
    OPEN
    MERGED
    CLOSED
  }

  enum ReviewValue {
    DISLIKE
    NEUTRAL
    LIKE
  }

  enum VoteRule {
    ONE_MEMBER_ONE_VOTE
    WEIGHT_BY_ROLE
    WEIGHT_BY_DELEGATE
  }

  enum VoteChoice {
    YES
    NO
    ABSTAIN
  }

  enum VoteRound {
    FIRST_READING
    AMENDMENT
    FINAL_VOTE
  }

  enum VoteSessionStatus {
    PENDING
    ACTIVE
    CLOSED
  }

  enum BadgeType {
    FIRST_PROPOSAL
    ACTIVE_VOTER
    CONSENSUS_BUILDER
    CAREFUL_REVIEWER
    CONTRIBUTOR
  }

  enum NotificationType {
    MENTION
    COMMENT
    STATUS_CHANGE
    VOTE_STARTED
    VOTE_ENDING_SOON
    PR_REVIEW_REQUEST
  }
`;