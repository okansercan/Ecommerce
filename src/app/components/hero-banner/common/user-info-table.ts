import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface UserInfoData {
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
  skills?: string[];
}

@Component({
  standalone: true,
  selector: 'app-user-info-table',
  imports: [CommonModule],
  template: `
    <div class="mt-4 p-3 bg-gray-50 rounded-md">
      <h4 class="text-sm font-semibold text-gray-700 mb-2">Form Bilgileri</h4>
      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="py-1 pr-2 text-gray-600 font-medium">İsim:</td>
              <td class="py-1 text-gray-800">{{ userInfo?.firstName || '-' }}</td>
            </tr>
            <tr>
              <td class="py-1 pr-2 text-gray-600 font-medium">Soyisim:</td>
              <td class="py-1 text-gray-800">{{ userInfo?.lastName || '-' }}</td>
            </tr>
            <tr>
              <td class="py-1 pr-2 text-gray-600 font-medium">Şehir:</td>
              <td class="py-1 text-gray-800">{{ userInfo?.city || '-' }}</td>
            </tr>
            <tr>
              <td class="py-1 pr-2 text-gray-600 font-medium">Ülke:</td>
              <td class="py-1 text-gray-800">{{ userInfo?.country || '-' }}</td>
            </tr>
            <tr>
              <td class="py-1 pr-2 text-gray-600 font-medium">E-posta:</td>
              <td class="py-1 text-gray-800">{{ userInfo?.email || '-' }}</td>
            </tr>
            <tr>
              <td class="py-1 pr-2 text-gray-600 font-medium">Telefon:</td>
              <td class="py-1 text-gray-800">{{ userInfo?.phone || '-' }}</td>
            </tr>
            <tr>
              <td class="py-1 pr-2 text-gray-600 font-medium">Yetenekler:</td>
              <td class="py-1 text-gray-800">
                <span *ngIf="hasSkills(); else noSkills" 
                      class="inline-flex flex-wrap gap-1">
                  <span *ngFor="let skill of userInfo!.skills!; let last = last" 
                        class="inline-block">
                    {{ skill }}<span *ngIf="!last">,</span>
                  </span>
                </span>
                <ng-template #noSkills>-</ng-template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class UserInfoTableComponent {
  @Input() userInfo: UserInfoData | null = null;

  hasSkills(): boolean {
    return !!(this.userInfo?.skills && this.userInfo.skills.length > 0);
  }
}