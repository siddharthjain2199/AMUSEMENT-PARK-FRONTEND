import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  galleryImages: string[];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.galleryImages = [
      '/assets/gallery/Apark1.jpg',
      '/assets/gallery/Apark2.jpg',
      '/assets/gallery/Apark3.jpg',
      '/assets/gallery/Apark4.jpg',
      '/assets/gallery/Apark5.jpg',
      '/assets/gallery/Apark6.jpg',
      '/assets/gallery/Apark7.jpg',
      '/assets/gallery/Apark8.jpg',
      'https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1300/544/75/dam/disneyland/home/revenue/distancing-carousel-1x1.jpg?1618494208908',
      'https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1300/544/75/dam/disneyland/home/revenue/pixar-pier-entrance-night-1x1.jpg?1618496272981',
      'https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1300/544/75/vision-dam/digital/parks-platform/parks-global-assets/disneyland/0714ZQ_0139CM_R1_DS-2-graded-1x1.jpg',
      'https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1300/544/75/dam/disneyland/home/destination/snow-white-dopey-1x1.jpg?1619787109686',
      'https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1300/544/75/dam/disneyland/home/revenue/mickey-welcome-disneyland.jpg?1618494208908',
      'https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1300/544/75/dam/disneyland/home/promos/shopdisney/buzz-fly-1x1.jpg?1618494186124',
    ];
  }

  openImageDialog(image: string) {
    this.dialog.open(DialogDataExampleDialog, {
      width: '60%',
      data: {
        imageUrl: image,
      },
    });
  }
}

@Component({
  template: `
    <div mat-dialog-content>
      <img
        src="{{ data.imageUrl }}"
        class="img img-fluid rounded"
        style="width: 100%;"
      />
    </div>
  `,
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
