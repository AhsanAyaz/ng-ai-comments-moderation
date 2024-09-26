import { NgClass } from '@angular/common';
import { Component, computed, inject, OnInit, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {
  GeminiService,
  NGGCSentiment,
  SentimentAnalyzerComponent,
} from '@codewithahsan/ng-gc';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SentimentAnalyzerComponent,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ng-ai-comments-moderation';
  fb = inject(FormBuilder);
  geminiService = inject(GeminiService);
  sentimentComponent = viewChild.required(SentimentAnalyzerComponent);
  commentForm = this.fb.nonNullable.group({
    comment: ['', Validators.required],
  });

  commentDebounced = toSignal(
    this.commentForm.controls.comment.valueChanges.pipe(debounceTime(1000)),
    {
      initialValue: '',
    }
  );

  isCommentToxic = computed(() => {
    const comp = this.sentimentComponent();
    const sentiment = comp.sentiment() as NGGCSentiment | null;
    return sentiment?.category === 'negative' && sentiment?.rating >= 7;
  });

  get commentDisabled() {
    const comp = this.sentimentComponent();
    const sentiment = comp.sentiment() as NGGCSentiment | null;
    if (this.commentForm.controls.comment.value && !sentiment) {
      return true;
    }
    if (comp.loading()) {
      return true;
    }

    return this.isCommentToxic();
  }

  updateApiKey(apiKey: string) {
    this.geminiService.geminiApiConfig.apiKey = apiKey;
    this.commentForm.controls.comment.enable();
  }

  ngOnInit(): void {
    if (!this.geminiService.geminiApiConfig.apiKey) {
      this.commentForm.controls.comment.disable();
    }
  }
}
