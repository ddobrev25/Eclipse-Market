import { Component } from '@angular/core';
import { SpinnerComponent } from './shared/spinner/spinner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EclipseMarket';

  public spinnerComponent = SpinnerComponent;
}
