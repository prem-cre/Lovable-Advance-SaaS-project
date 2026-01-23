async function main() {
    console.log('No seeding required for current models.');
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });