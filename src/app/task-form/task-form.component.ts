import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.params['id'] ? parseInt(this.route.snapshot.params['id'], 10) : null;

    if (this.taskId) {
      this.taskService.getTask(this.taskId).subscribe(task => {
        this.taskForm.patchValue(task);
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      if (this.taskId) {
        this.taskService.updateTask(this.taskId, task).subscribe(() => this.router.navigate(['/']));
      } else {
        this.taskService.addTask(task).subscribe(() => this.router.navigate(['/']));
      }
    }
  }
}
