import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {Comment} from '../../../../../data-access/src';
import {MatIconModule} from "@angular/material/icon";
import {CommentsFacade} from "../../../../../data-access/src/lib/+state/comments/comments.facade";

@Component({
  selector: 'article-comment',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,

  ],
  templateUrl: './article-comment.component.html',
  styleUrls: ['./article-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ArticleCommentComponent {

  private readonly commentFacade = inject(CommentsFacade);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  public isLiked: boolean = false;
  public likeCount: number = 0;

  @Input({required: true}) comment!: Comment;

  public handleLike(): void {
    this.isLiked = !this.isLiked;
    this.likeCount = this.isLiked ? 1 : 0;
    this.changeDetectorRef.detectChanges();
    this.commentFacade.likeComment(this.comment.id, this.isLiked);
  }
}
