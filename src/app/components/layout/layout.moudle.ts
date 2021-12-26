import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ZHeaderComponent } from "./header.components";
import { ZContentComponent } from "./content.components";
import { ZFooterComponent } from "./footer.components";
import { ZSideComponent } from "./sider.component";
import { ZLayoutComponents } from "./layout.components";

@NgModule({
  declarations: [
    ZHeaderComponent,
    ZContentComponent,
    ZFooterComponent,
    ZSideComponent,
    ZLayoutComponents,
  ],
  exports: [
    ZHeaderComponent,
    ZContentComponent,
    ZFooterComponent,
    ZSideComponent,
    ZLayoutComponents,
  ],
  imports: [CommonModule],
})
export class ZLayoutModule {}
