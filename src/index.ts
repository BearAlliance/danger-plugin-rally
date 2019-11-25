// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from '../node_modules/danger/distribution/dsl/DangerDSL';
declare var danger: DangerDSLType;
export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

const rallyStoryPattern = /US\d{7}/g;
const rallyDefectPattern = /DE\d{6}/g;

export interface RallyPluginConfig {
  domain?: string;
  requirePound: boolean;
}

function unique(array: any[]) {
  const seen: any[] = [];
  return array.filter(item => {
    const duplicate = seen.includes(item);
    seen.push(item);
    return !duplicate;
  });
}

function checkForPound(commitMessages) {
  const poundStoryPattern = /#US\d{7}/g;
  const poundDefectPattern = /#DE\d{6}/g;

  const poundStories = commitMessages.match(poundStoryPattern) || [];
  const poundDefects = commitMessages.match(poundDefectPattern) || [];

  const stories = commitMessages.match(rallyStoryPattern) || [];
  const defects = commitMessages.match(rallyDefectPattern) || [];

  const storyDifference = stories.filter(x => !poundStories.includes('#' + x));
  const defectDifference = defects.filter(x => !poundDefects.includes('#' + x));

  const difference = [...storyDifference, ...defectDifference];

  if (difference.length) {
    fail(
      `The following are referenced in the commit body, but are not prefixed by \`#\`.\n${difference
        .map(str => `- ${str}`)
        .join(
          '\n'
        )}\nTools like [standard-version](https://www.npmjs.com/package/standard-version) rely on this marker to generate links to the ticket in the \`CHANGELOG\``
    );
  }
}

/**
 * tools for linking rally stories to pull requests
 */
export default function rally(config?: RallyPluginConfig) {
  const defaultConfig = { domain: 'https://rally1.rallydev.com' };
  const { domain, requirePound } = { ...defaultConfig, ...config };

  const bbs = danger.bitbucket_server;
  const prDescription = bbs.pr.description;
  const prTitle = bbs.pr.title;

  const commitMessages = danger.git.commits
    .map(commit => commit.message)
    .join(' ');

  if (requirePound) {
    checkForPound(commitMessages);
  }

  const storyNumbers = (prDescription + prTitle + commitMessages).match(
    rallyStoryPattern
  );
  const defectNumbers = (prDescription + prTitle + commitMessages).match(
    rallyDefectPattern
  );

  if (storyNumbers) {
    const output = unique(storyNumbers).reduce(
      (acc, storyNumber) =>
        acc.concat(
          `\n - [${storyNumber}](${domain}/#/search?keywords=${storyNumber})`
        ),
      '**Stories Referenced:**'
    );
    markdown(output);
  }
  if (defectNumbers) {
    const output = unique(defectNumbers).reduce(
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
