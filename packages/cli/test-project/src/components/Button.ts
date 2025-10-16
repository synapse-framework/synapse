import { SynapseComponent } from '@snps/core';

export class Button extends SynapseComponent {
  constructor() {
    super();
  }

  render(): string {
    return `<div class="button">
      <h2>Button</h2>
    </div>`;
  }
}
