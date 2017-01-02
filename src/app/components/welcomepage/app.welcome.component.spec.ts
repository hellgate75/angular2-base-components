/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { WelcomeComponent } from './app.welcome.component';

describe('WelcomeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WelcomeComponent
      ],
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(WelcomeComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    let fixture = TestBed.createComponent(WelcomeComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Welcome!');
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(WelcomeComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome!');
  }));
});
