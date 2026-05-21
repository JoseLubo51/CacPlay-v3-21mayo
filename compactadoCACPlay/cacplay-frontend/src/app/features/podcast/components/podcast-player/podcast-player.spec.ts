import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastPlayer } from './podcast-player';

describe('PodcastPlayer', () => {
  let component: PodcastPlayer;
  let fixture: ComponentFixture<PodcastPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
