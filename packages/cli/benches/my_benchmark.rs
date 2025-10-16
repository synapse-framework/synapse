use criterion::{criterion_group, criterion_main, Criterion};
use std::process::Command;

fn benchmark_ls(c: &mut Criterion) {
    c.bench_function("ls -l", |b| {
        b.iter(|| {
            Command::new("ls")
                .arg("-l")
                .output()
                .expect("failed to execute process");
        });
    });
}

criterion_group!(benches, benchmark_ls);
criterion_main!(benches);