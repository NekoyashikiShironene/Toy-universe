export default function ProductFilter() {

    const categories = ['Construction', 'Doll', 'Model', 'Board Game'];
    const brands = ['LEGO', 'Mattel', 'American Girl', 'Disney', 'LOL Surprise', 'Hasbro', 'Bandai', 'Revell', 'Tamiya', 'Metal Earth', 'KOSMOS', 'Days of Wonder', 'Z-Man Games'];

    return (
        <>
            <h1>ProductFilter</h1>

            <div>
            {
                // categories.map(item => (

                // ))
               
                categories.map((item: string) => (
                    <>
                        <input type="checkbox"/>
                        <label>{item}</label>
                    </>

                ))
            }
            </div>

            <div>
            {
                // categories.map(item => (

                // ))
               
                brands.map((item: string) => (
                    <>
                        <input type="checkbox"/>
                        <label>{item}</label>
                    </>

                ))
            }
            </div>

            <label htmlFor="">price</label>
            <input type="range" />
        </>
    );
}