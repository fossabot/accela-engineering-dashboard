var vsts = require('vso-node-api');

const handler = vsts.getPersonalAccessTokenHandler(process.env.VSTS_KEY);
const api = new vsts.WebApi(process.env.VSTS_URI, handler);

function getBuildStatus(project, callback) {
    const build = api.getBuildApi();

    build.getDefinitions(project.vstsProject, project.vstsBuild)
    .then(definitions => {
        if (definitions.length) {
            return build.getBuilds(project.vstsProject, [definitions[0].id]);
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

function getPullRequests(project, callback) {
    const git = api.getGitApi();

    git.getRepositories(project.vstsProject)
    .then(repos => {
        repos = repos.filter(repo => repo.name == project.vstsRepo);
        
        if (repos.length) {
            return git.getPullRequestsByProject(project.vstsProject, {
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
