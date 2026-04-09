import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-podcast-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <iframe
      *ngIf="safeUrl"
      [src]="safeUrl"
      width="100%"
      height="352"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      class="rounded-lg shadow-lg">
    </iframe>
  `
})
export class PodcastPlayer implements OnChanges {
  @Input() src!: string;
  safeUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['src']?.currentValue) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.transformSpotifyUrl(this.src)
      );
    }
  }

  private transformSpotifyUrl(url: string): string {
    if (!url) return '';
    if (url.includes('/embed/')) return url;
    // Convierte URL normal a formato Embed
    return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
  }
}