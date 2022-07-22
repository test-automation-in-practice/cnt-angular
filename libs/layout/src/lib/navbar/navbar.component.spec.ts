import { MockBuilder, MockRender } from 'ng-mocks';
import { NavbarComponent } from './navbar.component';
import { LayoutModule } from '../layout.module';
import { NavbarEntry } from '../model/navigation.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, Location } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { MatButtonHarness } from '@angular/material/button/testing';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cntws-mock',
  template: '<span>mock</span>',
})
class MockComponent {}

describe('Navbar: A user', () => {
  describe('viewing the navbar', () => {
    beforeEach(() => MockBuilder(NavbarComponent, LayoutModule).replace(RouterModule, RouterTestingModule));

    it('should have a consistent layout', () => {
      const fixture = MockRender(NavbarComponent);
      expect(fixture).toMatchSnapshot();
    });
  });

  describe('clicking on a navbar button', () => {
    let fixture: ComponentFixture<NavbarComponent>;
    let component: NavbarComponent;
    let loader: HarnessLoader;
    let location: Location;

    const navbarEntries: NavbarEntry[] = [
      { displayName: 'First', buildRouterLink: () => 'first' },
      { displayName: 'Second', buildRouterLink: () => 'second' },
    ];
    const routes = navbarEntries.map((route) => ({ path: route.buildRouterLink(), component: MockComponent }));

    beforeEach(async () =>
      TestBed.configureTestingModule({
        declarations: [NavbarComponent, MockComponent],
        imports: [CommonModule, RouterTestingModule.withRoutes(routes), MatToolbarModule, MatButtonModule],
      }).compileComponents()
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(NavbarComponent);
      component = fixture.componentInstance;
      component.navbarEntries = navbarEntries;
      loader = TestbedHarnessEnvironment.loader(fixture);
      location = TestBed.inject(Location);
    });

    it('should be navigated to the according route', async () => {
      const navbarEntry = navbarEntries[0];
      const button = await loader.getHarness(MatButtonHarness.with({ text: navbarEntry.displayName }));
      await button.click();
      expect(location.path()).toEqual(`/${navbarEntry.buildRouterLink()}`);
    });
  });
});
