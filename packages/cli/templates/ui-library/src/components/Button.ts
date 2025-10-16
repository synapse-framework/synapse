import { SynapseComponent } from '@snps/core';

export class Button extends SynapseComponent {
  constructor(props: any = {}) {
    super();
    this.props = props;
  }
  
  render(): string {
    const { variant = 'primary', size = 'medium', children = 'Button' } = this.props;
    return `<button class="btn btn-${variant} btn-${size}">${children}</button>`;
  }
}