export enum OrgLevel {
  NATIONAL = "NATIONAL",
  STATE = "STATE",
  MUNICIPAL = "MUNICIPAL",
  THEMATIC = "THEMATIC",
}

export enum Role {
  FILIADO = "FILIADO",
  COORDENADOR = "COORDENADOR",
  DIRETOR = "DIRETOR",
  EXECUTIVO_NACIONAL = "EXECUTIVO_NACIONAL",
}

export enum ProposalStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  MERGED = "MERGED",
  REJECTED = "REJECTED",
  ARCHIVED = "ARCHIVED",
}

export enum IssueStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum PRStatus {
  OPEN = "OPEN",
  MERGED = "MERGED",
  CLOSED = "CLOSED",
}

export enum ReviewValue {
  DISLIKE = "DISLIKE",
  NEUTRAL = "NEUTRAL",
  LIKE = "LIKE",
}

export enum VoteRule {
  ONE_MEMBER_ONE_VOTE = "ONE_MEMBER_ONE_VOTE",
  WEIGHT_BY_ROLE = "WEIGHT_BY_ROLE",
  WEIGHT_BY_DELEGATE = "WEIGHT_BY_DELEGATE",
}

export enum VoteChoice {
  YES = "YES",
  NO = "NO",
  ABSTAIN = "ABSTAIN",
}

