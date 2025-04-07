import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphqlService } from '../services/graphql.service';

@Component({
  selector: 'app-missionlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './missionlist.component.html',
  styleUrls: ['./missionlist.component.scss']
})
export class MissionlistComponent implements OnInit {
  missions: any[] = [];

  constructor(private graphqlService: GraphqlService) {}

  ngOnInit(): void {
    this.graphqlService.getMissions().subscribe((result: any) => {
      this.missions = result.data.missions;
      console.log('📦 Missions:', this.missions); // Debugging log
    });
  }
}
