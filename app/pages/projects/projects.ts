import { Component } from '@angular/core';

@Component({
  selector: 'page-projects',
  templateUrl: '/pages/projects/projects.html'
})
export class ProjectsPage {
  projects: any[];

  ngOnInit() {
    this.projects = [
      { id: 1, name: "PMA", description: "Productivity Mobile App", jenkinsLatestBuildStatus: "good", gitHubPullRequestsCount: 3 },
      { id: 2, name: "ACA", description: "Accela Citizen Access", jenkinsLatestBuildStatus: "failed", gitHubPullRequestsCount: 4 },
      { id: 3, name: "AA", description: "Accela Automation", jenkinsLatestBuildStatus: "good", gitHubPullRequestsCount: 5 },
      { id: 4, name: "AGIS", description: "Accela GIS", jenkinsLatestBuildStatus: "good", gitHubPullRequestsCount: 6 },
    ];
  }
}