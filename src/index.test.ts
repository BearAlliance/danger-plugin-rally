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

  describe('options', () => {
    describe('bodyOnly', () => {
      describe('when stories are in the commit heading', () => {
        beforeEach(() => {
          global.danger = {
            bitbucket_server: {
              pr: { title: 'My Test Title', description: 'some description' }
            },
            git: {
              commits: [
                { message: 'chore: do something #US1234567\ncloses #US1234567' }
              ]
            }
          };
        });
        it('fails with a message', () => {
          rally({ bodyOnly: true });
          expect(global.fail).toHaveBeenCalledWith(
            'Story, Task, and Defect references should go in the commit body, not the title'
          );
        });
      });

      describe('when stories are in the commit body', () => {
        beforeEach(() => {
          global.danger = {
            bitbucket_server: {
              pr: { title: 'My Test Title', description: 'some description' }
            },
            git: {
              commits: [{ message: 'chore: do something\ncloses #US1234567' }]
            }
          };
        });
        it('does not fail', () => {
          rally({ bodyOnly: true });
          expect(global.fail).not.toHaveBeenCalled();
        });
      });

      describe('when there is no body', () => {
        beforeEach(() => {
          global.danger = {
            bitbucket_server: {
              pr: { title: 'My Test Title', description: 'some description' }
            },
            git: {
              commits: [{ message: 'chore: do something' }]
            }
          };
        });
        it('does not fail', () => {
          rally({ bodyOnly: true });
          expect(global.fail).not.toHaveBeenCalled();
        });
      });
    });
    describe('requirePound', () => {
      describe('when story numbers are not prefixed with a #', () => {
        beforeEach(() => {
          global.danger = {
            bitbucket_server: {
              pr: { title: 'My Test Title', description: 'some description' }
            },
            git: {
              commits: [{ message: 'chore: do something\ncloses US1234567' }]
            }
          };
        });
        it('fails with a message', () => {
          rally({ requirePound: true });
          expect(global.fail)
            .toHaveBeenCalledWith(`The following are referenced in the commit body, but are not prefixed by \`#\`.
- US1234567
Tools like [standard-version](https://www.npmjs.com/package/standard-version) rely on this marker to generate links to the ticket in the \`CHANGELOG\``);
        });
        it('fails with a message and skips merge commits', () => {
          global.danger = {
            bitbucket_server: {
              pr: { title: 'My Test Title', description: 'some description' }
            },
            git: {
              commits: [
                {
                  message:
                    'Merge pull request #1234 in BearAlliance/danger-plugin-rally from ~USER/danger-plugin-rally:feature/US1234567 to staging\n* commit h1a2s3h'
                },
                {
                  message: 'chore: do something\ncloses US1234567'
                }
              ]
            }
          };
          rally({ requirePound: true });
          expect(global.fail)
            .toHaveBeenCalledWith(`The following are referenced in the commit body, but are not prefixed by \`#\`.
- US1234567
Tools like [standard-version](https://www.npmjs.com/package/standard-version) rely on this marker to generate links to the ticket in the \`CHANGELOG\``);
        });
      });

      describe('when story numbers are prefixed with a #', () => {
        beforeEach(() => {
          global.danger = {
            bitbucket_server: {
              pr: { title: 'My Test Title', description: 'some description' }
            },
            git: {
              commits: [{ message: 'chore: do something\ncloses #US1234567' }]
            }
          };
        });
        it('does not fail', () => {
          rally({ requirePound: true });
          expect(global.fail).not.toHaveBeenCalled();
        });
        it('does not fail and skips merge commits', () => {
          global.danger = {
            bitbucket_server: {
              pr: { title: 'My Test Title', description: 'some description' }
            },
            git: {
              commits: [
                {
                  message:
                    'Merge pull request #1234 in BearAlliance/danger-plugin-rally from ~USER/danger-plugin-rally:feature/US1234567 to staging\n* commit h1a2s3h'
                },
                {
                  message: 'chore: do something\ncloses #US1234567'
                }
              ]
            }
          };
          rally({ requirePound: true });
          expect(global.fail).not.toHaveBeenCalled();
        });
      });
    });
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
      rally();
      expect(global.warn).toHaveBeenCalledWith(
        'No assigned story, task, or defect'
      );
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
    rally();
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
    rally();
    expect(global.markdown).toHaveBeenCalledWith(
      `**Defects Referenced:**\n - [DE123456](https://rally1.rallydev.com/#/search?keywords=DE123456)`
    );
  });

  it('looks for tasks in commit message', () => {
    global.danger = {
      bitbucket_server: {
        pr: { title: 'My Test Title', description: 'some description' }
      },
      git: {
        commits: [{ message: 'chore: do something\n\n resolves TA1234567' }]
      }
    };
    rally();
    expect(global.markdown).toHaveBeenCalledWith(
      `**Tasks Referenced:**\n - [TA1234567](https://rally1.rallydev.com/#/search?keywords=TA1234567)`
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
    rally();
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
    rally();
    expect(global.markdown).toHaveBeenCalledWith(
      `**Defects Referenced:**\n - [DE123456](https://rally1.rallydev.com/#/search?keywords=DE123456)`
    );
  });

  it('looks for tasks in PR titles', () => {
    global.danger = {
      bitbucket_server: {
        pr: {
          title: 'TA1234567 My Test Title',
          description: 'some description'
        }
      },
      git: { commits: [{ message: 'chore: do something' }] }
    };
    rally();
    expect(global.markdown).toHaveBeenCalledWith(
      `**Tasks Referenced:**\n - [TA1234567](https://rally1.rallydev.com/#/search?keywords=TA1234567)`
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
    rally();
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
    rally();
    expect(global.markdown).toHaveBeenCalledWith(
      `**Defects Referenced:**\n - [DE123456](https://rally1.rallydev.com/#/search?keywords=DE123456)`
    );
  });

  it('looks for tasks in PR descriptions', () => {
    global.danger = {
      bitbucket_server: {
        pr: {
          title: 'My Test Title',
          description: 'some description closes TA1234567'
        }
      },
      git: { commits: [{ message: 'chore: do something' }] }
    };
    rally();
    expect(global.markdown).toHaveBeenCalledWith(
      `**Tasks Referenced:**\n - [TA1234567](https://rally1.rallydev.com/#/search?keywords=TA1234567)`
    );
  });

  it('only prints story references one time', () => {
    global.danger = {
      bitbucket_server: {
        pr: {
          title: 'My Test Title',
          description: 'some description closes US1234567'
        }
      },
      git: {
        commits: [
          { message: 'chore: do something' },
          { message: 'contributes to US1234567' }
        ]
      }
    };
    rally();
    expect(global.markdown).toHaveBeenCalledWith(
      `**Stories Referenced:**\n - [US1234567](https://rally1.rallydev.com/#/search?keywords=US1234567)`
    );
  });

  it('only prints defect references one time', () => {
    global.danger = {
      bitbucket_server: {
        pr: {
          title: 'My Test Title',
          description: 'some description closes DE123456'
        }
      },
      git: {
        commits: [
          { message: 'chore: do something' },
          { message: 'contributes to DE123456' }
        ]
      }
    };
    rally();
    expect(global.markdown).toHaveBeenCalledWith(
      `**Defects Referenced:**\n - [DE123456](https://rally1.rallydev.com/#/search?keywords=DE123456)`
    );
  });

  it('only prints task references one time', () => {
    global.danger = {
      bitbucket_server: {
        pr: {
          title: 'My Test Title',
          description: 'some description closes TA1234567'
        }
      },
      git: {
        commits: [
          { message: 'chore: do something' },
          { message: 'contributes to TA1234567' }
        ]
      }
    };
    rally();
    expect(global.markdown).toHaveBeenCalledWith(
      `**Tasks Referenced:**\n - [TA1234567](https://rally1.rallydev.com/#/search?keywords=TA1234567)`
    );
  });
});
