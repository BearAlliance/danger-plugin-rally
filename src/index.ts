// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from 'danger/distribution/dsl/DangerDSL';
import { getPrDescription, getPrTitle } from './pr-info';
declare var danger: DangerDSLType;
export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

const rallyStoryPattern = /US\d{7}/g;
const rallyDefectPattern = /DE\d{6}/g;
const rallyTaskPattern = /TA\d{7}/g;
const mergeCommitPattern = /^Merge (pull request|branch)/;

export interface RallyPluginConfig {
  domain?: string;
  requirePound?: boolean;
  bodyOnly?: boolean;
}

function unique(array: any[]) {
  const seen: any[] = [];
  return array.filter((item) => {
    const duplicate = seen.includes(item);
    seen.push(item);
    return !duplicate;
  });
}

function checkBody(commitMessages) {
  commitMessages.forEach((commitMessage) => {
    const commitTitle = commitMessage.split('\n')[0];
    if (
      commitTitle.match(rallyStoryPattern) ||
      commitTitle.match(rallyDefectPattern) ||
      commitTitle.match(rallyTaskPattern)
    ) {
      fail(
        'Story, Task, and Defect references should go in the commit body, not the title'
      );
    }
  });
}

function checkForPound(commitMessages) {
  const poundStoryPattern = /#US\d{7}/g;
  const poundDefectPattern = /#DE\d{6}/g;
  const poundTaskPattern = /#TA\d{7}/g;

  const poundStories = commitMessages.match(poundStoryPattern) || [];
  const poundDefects = commitMessages.match(poundDefectPattern) || [];
  const poundTasks = commitMessages.match(poundTaskPattern) || [];

  const stories = commitMessages.match(rallyStoryPattern) || [];
  const defects = commitMessages.match(rallyDefectPattern) || [];
  const tasks = commitMessages.match(rallyTaskPattern) || [];

  const storyDifference = stories.filter(
    (x) => !poundStories.includes('#' + x)
  );
  const defectDifference = defects.filter(
    (x) => !poundDefects.includes('#' + x)
  );
  const taskDifference = tasks.filter((x) => !poundTasks.includes('#' + x));

  const difference = [
    ...storyDifference,
    ...defectDifference,
    ...taskDifference,
  ];

  if (difference.length) {
    fail(
      `The following are referenced in the commit body, but are not prefixed by \`#\`.\n${difference
        .map((str) => `- ${str}`)
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
  const defaultConfig: RallyPluginConfig = {
    domain: 'https://rally1.rallydev.com',
    requirePound: false,
    bodyOnly: false,
  };
  const { domain, requirePound, bodyOnly } = { ...defaultConfig, ...config };
  const prTitle = getPrTitle(danger);
  const prDescription = getPrDescription(danger);

  const nonMergeCommits = danger.git.commits.filter(
    (commit) => !commit.message.match(mergeCommitPattern)
  );
  const commitMessages = nonMergeCommits
    .map((commit) => commit.message)
    .join('\n');

  if (requirePound) {
    checkForPound(commitMessages);
  }
  if (bodyOnly) {
    checkBody(nonMergeCommits.map((commit) => commit.message));
  }

  const storyNumbers = (prDescription + prTitle + commitMessages).match(
    rallyStoryPattern
  );
  const defectNumbers = (prDescription + prTitle + commitMessages).match(
    rallyDefectPattern
  );
  const taskNumbers = (prDescription + prTitle + commitMessages).match(
    rallyTaskPattern
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
  if (taskNumbers) {
    const output = unique(taskNumbers).reduce(
      (acc, taskNumber) =>
        acc.concat(
          `\n - [${taskNumber}](${domain}/#/search?keywords=${taskNumber})`
        ),
      '**Tasks Referenced:**'
    );
    markdown(output);
  }

  if (!storyNumbers && !defectNumbers && !taskNumbers) {
    warn('No assigned story, task, or defect');
  }
}
