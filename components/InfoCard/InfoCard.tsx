import Image from 'next/image';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';

export function InfoCard() {
  return (
    <>
      <Card className="p-0">
        <div className="flex items-center overflow-hidden relative justify-center h-64 bg-black rounded-t-xl">
          <Image
            src="https://source.unsplash.com/GNwiKB34eGs"
            alt=""
            fill
            style={{objectFit: 'cover'}}
          />
        </div>
        <div className="p-4">
          <div className="mb-2">
            <SectionTitle color="green" className="mr-2">
              What
            </SectionTitle>
            <Button variant="link-neutral">Share</Button>
          </div>
          <Text className="text-2xl font-bold">This is event name</Text>
          <div />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec
            sagittis nibh. Donec eu eros et odio iaculis tempor. Mauris in
            semper ligula. Vestibulum turpis velit, commodo placerat odio in,
            dictum aliquet augue. Quisque a quam efficitur, mollis ante
            convallis, tristique nulla. Curabitur feugiat nisi et nunc
            ultricies, et commodo libero sodales. Pellentesque at ligula nec
            massa suscipit fringilla sit amet sed ante. Pellentesque pharetra,
            ante eget aliquet auctor, dolor nisl aliquam eros, nec ultricies
            tellus odio eget lacus. Nulla interdum elit at tempus iaculis.
            Praesent turpis enim, luctus et rhoncus vitae, tempus eu erat.
            Aenean sagittis, metus condimentum sollicitudin maximus, augue
            sapien volutpat tortor, malesuada hendrerit est diam in erat.
          </Text>
        </div>
      </Card>
    </>
  );
}
