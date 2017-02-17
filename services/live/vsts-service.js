var vsts = require('vso-node-api');

const handler = vsts.getPersonalAccessTokenHandler(process.env.VSTS_KEY);
const api = new vsts.WebApi(process.env.VSTS_URI, handler);

function getBuildStatus(vstsProject, vstsBuild, callback) {
    const build = api.getBuildApi();

    build.getDefinitions(vstsProject, vstsBuild)
    .then(definitions => {
        if (definitions.length) {
            return build.getBuilds(vstsProject, [definitions[0].id]);
        }
    })
    .then(builds => {

        let status = 'MISSING';
        let validStatuses = [2, 4, 8];
        builds = builds.filter(build => validStatuses.indexOf(build.result) > -1);
        if (builds.length) {
            
            switch (builds[0].status) {
                case 2:
                    status = 'SUCCESS';
                    break;
                case 4:
                    status = 'PARTIAL';
                    break;
                case 8:
                    status = 'FAILED';
                    break;
            }
        }
        
        callback(null, {
            result: status
        });
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