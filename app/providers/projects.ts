import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/add/operator/map'

@Injectable()
export class ProjectsProvider {

    constructor(
        private http: Http
    ) { }

    getProjects() {
      return this.http.get("/api/projects")
        .map((res: Response) => res.json())
        .map(res => res.projects);
    }

    getBuildStatus(buildId) {
        return this.http.get(`/api/builds/${buildId}`)
            .map((res: Response) => res.json());
    }

    getGitHubInfo(projectId) {
        return this.http.get(`/api/github/${projectId}`)
            .map((res: Response) => res.json());
    }
}
