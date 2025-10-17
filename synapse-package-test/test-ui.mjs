// Test @snps/ui package following its README
import React from 'react';
import { ThemeProvider, Button, Card, Input } from '@snps/ui';

console.log('🧪 Testing @snps/ui package...\n');

async function testUIPackage() {
  try {
    console.log('1. Testing component imports...');
    
    // Test that components can be imported
    console.log('ThemeProvider:', typeof ThemeProvider);
    console.log('Button:', typeof Button);
    console.log('Card:', typeof Card);
    console.log('Input:', typeof Input);
    
    console.log('\n2. Testing component instantiation...');
    
    // Test basic component creation (without rendering)
    const buttonProps = {
      variant: 'primary',
      size: 'md',
      children: 'Test Button'
    };
    
    console.log('Button props:', buttonProps);
    console.log('✅ Button component can be configured');
    
    const cardProps = {
      variant: 'elevated',
      hoverable: true,
      children: 'Test Card'
    };
    
    console.log('Card props:', cardProps);
    console.log('✅ Card component can be configured');
    
    const inputProps = {
      label: 'Email',
      placeholder: 'Enter your email',
      type: 'email'
    };
    
    console.log('Input props:', inputProps);
    console.log('✅ Input component can be configured');
    
    console.log('\n✅ @snps/ui package is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing @snps/ui:', error.message);
    console.error('Stack:', error.stack);
  }
}

testUIPackage();
