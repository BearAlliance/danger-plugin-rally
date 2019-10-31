// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from '../node_modules/danger/distribution/dsl/DangerDSL';
declare var danger: DangerDSLType;
export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

/**
 * tools for linking rally stories to pull requests
 */
export default function rally({ domain = 'https://rally1.rallydev.com' }) {
  const bbs = danger.bitbucket_server;
  const prDescription = bbs.pr.description;
  const prTitle = bbs.pr.title;
  const rallyStoryPattern = /US\d{7}/g;
  const rallyDefectPattern = /DE\d{6}/g;

  const commitMessages = danger.git.commits
    .map(commit => commit.message)
    .join(' ');
  const storyNumbers = (prDescription + prTitle + commitMessages).match(
    rallyStoryPattern
  );
  const defectNumbers = (prDescription + prTitle + commitMessages).match(
    rallyDefectPattern
  );

  if (storyNumbers) {
    const output = storyNumbers.reduce(
      (acc, storyNumber) =>
        acc.concat(
          `\n - [${storyNumber}](${domain}/#/search?keywords=${storyNumber})`
        ),
      '**Stories Referenced:**'
    );
    markdown(output);
  }
  if (defectNumbers) {
    const output = defectNumbers.reduce(
      (acc, defectNumber) =>
        acc.concat(
          `\n - [${defectNumber}](${domain}/#/search?keywords=${defectNumber})`
        ),
      '**Defects Referenced:**'
    );
    markdown(output);
  }

  if (!storyNumbers && !defectNumbers) {
    warn('No assigned story or defect');
  }
}
