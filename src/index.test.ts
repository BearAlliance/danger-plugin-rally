import rally from './index';

declare const global: any;

describe('rally', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.message = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();
  });

  afterEach(() => {
    global.warn = undefined;
    global.message = undefined;
    global.fail = undefined;
    global.markdown = undefined;
  });

  describe('When there is no rally story in the Title, body, or commit message', () => {
    beforeEach(() => {
      global.danger = {
        bitbucket_server: {
          pr: { title: 'My Test Title', description: 'some description' }
        },
        git: { commits: [{ message: 'chore: do something' }] }
      };
    });
    it('prints a warning', () => {
      rally({});
      expect(global.warn).toHaveBeenCalledWith('No assigned story or defect');
    });
  });

  it('looks for stories in commit message', () => {
    global.danger = {
      bitbucket_server: {
        pr: { title: 'My Test Title', description: 'some description' }
      },
      git: {
        commits: [{ message: 'chore: do something\n\n resolves US1234567' }]
      }
    };
    rally({});
    expect(global.markdown).toHaveBeenCalledWith(
      `**Stories Referenced:**\n - [US1234567](https://rally1.rallydev.com/#/search?keywords=US1234567)`
    );
  });

  it('looks for defects in commit message', () => {
    global.danger = {
      bitbucket_server: {
        pr: { title: 'My Test Title', description: 'some description' }
      },
      git: {
        commits: [{ message: 'chore: do something\n\n resolves DE123456' }]
      }
    };
    rally({});
    expect(global.markdown).toHaveBeenCalledWith(
      `**Defects Referenced:**\n - [DE123456](https://rally1.rallydev.com/#/search?keywords=DE123456)`
    );
  });

  it('looks for stories in PR titles', () => {
    global.danger = {
      bitbucket_server: {
        pr: {
          title: 'US1234567 My Test Title',
          description: 'some description'
        }
      },
      git: { commits: [{ message: 'chore: do something' }] }
    };
    rally({});
    expect(global.markdown).toHaveBeenCalledWith(
      `**Stories Referenced:**\n - [US1234567](https://rally1.rallydev.com/#/search?keywords=US1234567)`
    );
  });

  it('looks for defects in PR titles', () => {
    global.danger = {
      bitbucket_server: {
        pr: { title: 'DE123456 My Test Title', description: 'some description' }
      },
      git: { commits: [{ message: 'chore: do something' }] }
    };
    rally({});
    expect(global.markdown).toHaveBeenCalledWith(
      `**Defects Referenced:**\n - [DE123456](https://rally1.rallydev.com/#/search?keywords=DE123456)`
    );
  });

  it('looks for stories in PR descriptions', () => {
    global.danger = {
      bitbucket_server: {
        pr: {
          title: 'My Test Title',
          description: 'some description closes US1234567'
        }
      },
      git: { commits: [{ message: 'chore: do something' }] }
    };
    rally({});
    expect(global.markdown).toHaveBeenCalledWith(
      `**Stories Referenced:**\n - [US1234567](https://rally1.rallydev.com/#/search?keywords=US1234567)`
    );
  });

  it('looks for defects in PR descriptions', () => {
    global.danger = {
      bitbucket_server: {
        pr: {
          title: 'My Test Title',
          description: 'some description closes DE123456'
        }
      },
      git: { commits: [{ message: 'chore: do something' }] }
    };
    rally({});
    expect(global.markdown).toHaveBeenCalledWith(
      `**Defects Referenced:**\n - [DE123456](https://rally1.rallydev.com/#/search?keywords=DE123456)`
    );
  });
});
