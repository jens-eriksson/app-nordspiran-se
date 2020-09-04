import { Injectable } from '@angular/core';

declare var google: any;

@Injectable()
export class ChartProvider {
    private google: any;
    constructor() {
        this.google = google;
    }

    getGoogle() {
        return this.google;
    }
}
