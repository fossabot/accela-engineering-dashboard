var vsts = require('vso-node-api');

const handler = vsts.getPersonalAccessTokenHandler(process.env.VSTS_KEY);
const api = new vsts.WebApi(process.env.VSTS_URI, handler);

function getBuildStatus(vstsProject, vstsBuild, callback) {
    const buildApi = api.getBuildApi();

    buildApi.getDefinitions(vstsProject, vstsBuild)
    .then(definitions => {
        if (definitions.length) {
            return buildApi.getBuilds(vstsProject, [definitions[0].id]);
        }
    })
    .then(builds => {

        let status = 'MISSING';
        let validStatuses = [2, 4, 8];
        builds = builds.filter(build => validStatuses.indexOf(build.result) > -1);
        if (builds.length) {
            
            let build = builds[0];
            switch (build.status) {
                case 2:
                    status = 'passing';
                    break;
                case 4:
                    status = 'partial';
                    break;
                case 8:
                    status = 'failed';
                    break;
            }

            buildApi.getBuildChanges(vstsProject, build.id)
            .then(changes => {
                callback(null, {
                    runDate: build.startTime,
                    status: status,
                    duration: (build.finishTime - build.startTime),
                    changes: changes.map(change => {
                        return {
                            comment: change.message,
                            commitId: change.id
                        };
                    })
                });
            });
        }
    })
    .catch(reason => {
        callback(reason);
    });
}

function getPullRequests(vstsProject, vstsRepo, callback) {
    const git = api.getGitApi();

    git.getRepositories(vstsProject)
    .then(repos => {
        repos = repos.filter(repo => repo.name == vstsRepo);
        
        if (repos.length) {
            return git.getPullRequestsByProject(vstsProject, {
                repositoryId: repos[0].id
            });
        }
    })
    .then(requests => {
        callback(null, requests);
    }).catch(reason => {
        callback(reason);
    });
}



module.exports = {
  getPullRequests: getPullRequests,
  getBuildStatus: getBuildStatus
}