import type { FullConfig, Reporter, Suite, TestCase } from '@playwright/test/reporter';

class CustomReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite): void {
    console.log(this.generateStartingMessage(config, suite));
  }

  onTestBegin(test: TestCase): void {
    test.title += ` [${test.titlePath()[1]}]`;
  }

  protected generateStartingMessage(config: FullConfig, suite: Suite): string {
    const jobs = config.metadata.actualWorkers ?? config.workers;
    const shardDetails = config.shard ? `, shard ${config.shard.current} of ${config.shard.total}` : '';
    const totalTestCount = suite.allTests().length;
    if (!totalTestCount) {
      return '';
    }
    return (
      '\nRunning ' +
      totalTestCount +
      ` test${totalTestCount !== 1 ? 's' : ''} using ` +
      jobs +
      ` worker${jobs !== 1 ? 's' : ''}${shardDetails}`
    );
  }
}

export default CustomReporter;
