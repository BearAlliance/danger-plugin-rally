import { DangerDSL } from 'danger/distribution/dsl/DangerDSL';

export function getPrTitle(danger: DangerDSL): string {
  if (danger.github) {
    return danger.github.pr.title;
  } else if (danger.bitbucket_server) {
    return danger.bitbucket_server.pr.title;
  } else {
    throw new Error(
      'Rally plugin: Cannot get GitHub or BitBucket server PR information'
    );
  }
}

export function getPrDescription(danger: DangerDSL): string {
  if (danger.github) {
    return danger.github.pr.body;
  } else if (danger.bitbucket_server) {
    return danger.bitbucket_server.pr.description;
  } else {
    throw new Error(
      'Rally plugin: Cannot get GitHub or BitBucket server PR information'
    );
  }
}
