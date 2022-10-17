import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateEuroComponent } from './rate-euro.component';

describe('RateComponent', () => {
    let component: RateEuroComponent;
    let fixture: ComponentFixture<RateEuroComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RateEuroComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RateEuroComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
