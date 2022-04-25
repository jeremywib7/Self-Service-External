import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-image-loader',
    templateUrl: './image-loader.component.html',
    styleUrls: ['./image-loader.component.scss']
})
export class ImageLoaderComponent implements OnInit {

    @Input('imageSource') imageSource: any;
    constructor() {
    }

    ngOnInit(): void {
    }

}
