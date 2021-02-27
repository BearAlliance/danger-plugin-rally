import { getPrDescription, getPrTitle } from './pr-info';
import { Mock } from 'ts-mockery';
import { DangerDSL } from 'danger/distribution/dsl/DangerDSL';

describe('pr info', () => {
  describe('getPrTitle', () => {
    describe('bitbucket_server', () => {
      it('should return the PR title', () => {
        const danger = Mock.of<DangerDSL>({
          bitbucket_server: { pr: { title: 'foo title' } },
        });
        expect(getPrTitle(danger)).toEqual('foo title');
      });
    });

    describe('github', () => {
      it('should return the pr title', () => {
        const danger = Mock.of<DangerDSL>({
          github: { pr: { title: 'foo title' } },
        });
        expect(getPrTitle(danger)).toEqual('foo title');
      });
    });

    describe('no scm', () => {
      it('should throw', () => {
        const danger = Mock.of<DangerDSL>();
        expect(() => getPrTitle(danger)).toThrow();
      });
    });
  });

  describe('getPrDescription', () => {
    describe('bitbucket_server', () => {
      it('should return the pr description', () => {
        const danger = Mock.of<DangerDSL>({
          bitbucket_server: { pr: { description: 'bar description' } },
        });
        expect(getPrDescription(danger)).toEqual('bar description');
      });
    });

    describe('github', () => {
      it('should return the pr description', () => {
        const danger = Mock.of<DangerDSL>({
          github: { pr: { body: 'bar description' } },
        });
        expect(getPrDescription(danger)).toEqual('bar description');
      });
    });

    describe('no scm', () => {
      const danger = Mock.of<DangerDSL>();
      expect(() => getPrDescription(danger)).toThrow();
    });
  });
});
