import { Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SentimentAnalyzerComponent } from '@codewithahsan/ng-gc';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SentimentAnalyzerComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-gc-moderation';
  fb = inject(FormBuilder);
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

  get commentDisabled() {
    const comp = this.sentimentComponent();
    if (this.commentForm.controls.comment.value && !comp.sentiment()) {
      return true;
    }
    return comp.sentiment()?.sentiment === 'toxic' || comp.loading();
  }
}
