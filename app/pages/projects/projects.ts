import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ProjectsProvider } from '../../providers/projects';
import * as _ from 'lodash';

@Component({
  selector: 'page-projects',
  templateUrl: '/pages/projects/projects.html'
})
export class ProjectsPage {
  projects: any[];

  constructor(
    private projectsProvider: ProjectsProvider
  ) {
  }

  ngOnInit() {
    this.projectsProvider.getProjects()
      .subscribe(res => {
        this.projects = res;

        let buildStatusRequests = _.flatMap(res, project => project.builds)
          .map(build => {
            return this.projectsProvider.getBuildStatus(build.id);
          });

        let buildStatuses = Observable.merge(...buildStatusRequests)
          .subscribe(
            buildStatus => {
              this.updateBuildStatus(buildStatus);
            }
          );

        let gitHubRequests = res.map(project => {
          return this.projectsProvider.getGitHubInfo(project.id);
        })

        let gitHubData = Observable.merge(...gitHubRequests)
          .subscribe(
            gitHubInfo => {
              this.updateGitHubInfo(gitHubInfo);
            }
          );
      });
  }

  private updateBuildStatus(buildStatus) {
    let project = _.filter(this.projects, { builds: [ { id: buildStatus.id } ]})[0];
    let build = project.builds.find(x => x.id === buildStatus.id);
    Object.assign(build, buildStatus);
  }

  private updateGitHubInfo(gitHubInfo) {
    let project = this.projects.find(x => x.id === gitHubInfo.projectId);
    project.github = gitHubInfo;
  }
}